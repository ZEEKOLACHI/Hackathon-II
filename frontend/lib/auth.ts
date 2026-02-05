import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || "fallback-secret-key";

export interface User {
  id: string;
  email: string;
  name: string;
}

// Initialize users table
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function signUp(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
  await initDB();

  // Check if user exists
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name",
    [email, name, passwordHash]
  );

  const user = result.rows[0];
  const token = jwt.sign({ sub: user.id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { user: { id: user.id.toString(), email: user.email, name: user.name }, token };
}

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  await initDB();

  // Find user
  const result = await pool.query("SELECT id, email, name, password_hash FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // Check password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ sub: user.id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { user: { id: user.id.toString(), email: user.email, name: user.name }, token };
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
  } catch {
    return null;
  }
}
