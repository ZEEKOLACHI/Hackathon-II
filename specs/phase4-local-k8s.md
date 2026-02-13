# Phase IV: Local Kubernetes Deployment Specification

## Overview
Containerize the frontend and backend applications and deploy them to a local Minikube Kubernetes cluster with an in-cluster PostgreSQL database.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Minikube Cluster                           │
│  namespace: todo-app                                         │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐ │
│  │   Frontend   │──▶│   Backend    │──▶│   PostgreSQL     │ │
│  │  (Next.js)   │   │  (FastAPI)   │   │   (In-Cluster)   │ │
│  │  2 replicas  │   │  2 replicas  │   │   1 replica + PVC│ │
│  │  NodePort    │   │  ClusterIP   │   │   ClusterIP      │ │
│  └──────────────┘   └──────────────┘   └──────────────────┘ │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐                        │
│  │   Secrets    │   │  ConfigMap   │                        │
│  └──────────────┘   └──────────────┘                        │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack Addition

| Component | Technology |
|-----------|------------|
| Container Runtime | Docker |
| Kubernetes Distribution | Minikube |
| CLI | kubectl |
| Database | PostgreSQL 16 (in-cluster) |
| Container Registry | Minikube built-in (eval $(minikube docker-env)) |

## Dockerfiles

### backend/Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### frontend/Dockerfile

```dockerfile
# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

> **Note:** The frontend `next.config.js` must include `output: "standalone"` for the multi-stage build to work.

## docker-compose.yml

For local pre-K8s smoke testing:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: todo_user
      POSTGRES_PASSWORD: todo_pass
      POSTGRES_DB: todo_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://todo_user:todo_pass@postgres:5432/todo_db
      BETTER_AUTH_SECRET: dev-secret-change-in-production
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on:
      - backend

volumes:
  pgdata:
```

## Kubernetes Manifests

All manifests live in the `k8s/` directory at the project root.

### k8s/namespace.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: todo-app
```

### k8s/secrets.yaml

Template — values must be base64-encoded before applying.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-app-secrets
  namespace: todo-app
type: Opaque
data:
  DATABASE_URL: <base64-encoded: postgresql://todo_user:todo_pass@postgres-service:5432/todo_db>
  BETTER_AUTH_SECRET: <base64-encoded-value>
  GEMINI_API_KEY: <base64-encoded-value>
```

### k8s/configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-app-config
  namespace: todo-app
data:
  FRONTEND_URL: "http://frontend-service:3000"
  NEXT_PUBLIC_API_URL: "http://backend-service:8000"
```

### k8s/postgres-pvc.yaml

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: todo-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

### k8s/postgres-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: todo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: "todo_user"
            - name: POSTGRES_PASSWORD
              value: "todo_pass"
            - name: POSTGRES_DB
              value: "todo_db"
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: todo-app
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
```

### k8s/backend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: todo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: todo-backend:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 8000
          envFrom:
            - secretRef:
                name: todo-app-secrets
            - configMapRef:
                name: todo-app-config
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 15
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: todo-app
spec:
  selector:
    app: backend
  ports:
    - port: 8000
      targetPort: 8000
  type: ClusterIP
```

### k8s/frontend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: todo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: todo-frontend:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: todo-app-config
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: todo-app
spec:
  selector:
    app: frontend
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30080
  type: NodePort
```

## Environment Variables

Mapping from K8s resources to existing backend config (`backend/app/config.py`):

| Env Var | Source | K8s Resource |
|---------|--------|--------------|
| `DATABASE_URL` | `postgresql://todo_user:todo_pass@postgres-service:5432/todo_db` | Secret (`todo-app-secrets`) |
| `BETTER_AUTH_SECRET` | User-provided | Secret (`todo-app-secrets`) |
| `GEMINI_API_KEY` | User-provided | Secret (`todo-app-secrets`) |
| `FRONTEND_URL` | `http://frontend-service:3000` | ConfigMap (`todo-app-config`) |
| `NEXT_PUBLIC_API_URL` | `http://backend-service:8000` | ConfigMap (`todo-app-config`) |

## Deployment Steps

1. **Start Minikube**
   ```bash
   minikube start --driver=docker
   ```

2. **Point Docker to Minikube's daemon**
   ```bash
   eval $(minikube docker-env)       # Linux/macOS
   minikube docker-env | Invoke-Expression  # PowerShell
   ```

3. **Build container images**
   ```bash
   docker build -t todo-backend:latest ./backend
   docker build -t todo-frontend:latest ./frontend
   ```

4. **Apply namespace**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

5. **Create secrets** (encode your values first)
   ```bash
   kubectl apply -f k8s/secrets.yaml
   ```

6. **Apply config and storage**
   ```bash
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/postgres-pvc.yaml
   ```

7. **Deploy PostgreSQL**
   ```bash
   kubectl apply -f k8s/postgres-deployment.yaml
   kubectl wait --namespace todo-app --for=condition=ready pod -l app=postgres --timeout=60s
   ```

8. **Deploy backend**
   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl wait --namespace todo-app --for=condition=ready pod -l app=backend --timeout=60s
   ```

9. **Deploy frontend**
   ```bash
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl wait --namespace todo-app --for=condition=ready pod -l app=frontend --timeout=60s
   ```

10. **Access the application**
    ```bash
    minikube service frontend-service -n todo-app
    ```

## Health Checks

The backend exposes `GET /health` (returns `{"status": "healthy"}`), used for both K8s probes:

| Probe | Path | Initial Delay | Period | Timeout | Failure Threshold |
|-------|------|---------------|--------|---------|-------------------|
| Liveness | `/health` | 10s | 15s | 3s | 3 |
| Readiness | `/health` | 5s | 10s | 3s | 3 |

**Liveness** — restarts the container if the process is hung.
**Readiness** — removes the pod from service endpoints until it can handle traffic.

## Success Criteria

1. All pods in `todo-app` namespace reach `Running` status (`kubectl get pods -n todo-app`)
2. Frontend is accessible in the browser via `minikube service frontend-service -n todo-app`
3. Backend health check returns `{"status": "healthy"}` from within the cluster
4. User can sign up, create tasks, and use AI features end-to-end through the Minikube-hosted app
5. Data persists across pod restarts — delete the postgres pod and verify tasks still exist after reschedule
6. Rolling update works — rebuild an image and apply the deployment without downtime
