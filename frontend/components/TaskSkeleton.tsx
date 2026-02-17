import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-3 p-4">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
