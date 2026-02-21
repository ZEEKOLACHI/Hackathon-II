import Link from "next/link";
import { Sparkles, CheckCircle, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight">
            Todo{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
        </div>

        <p className="text-xl text-muted-foreground mb-8">
          Simple task management. Create, organize, and complete tasks
          with ease using filters, priorities, and progress tracking.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex flex-col items-center text-center gap-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <h3 className="font-semibold">Smart Parsing</h3>
            <p className="text-sm text-muted-foreground">
              Type naturally and AI extracts tasks, dates, and priorities.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h3 className="font-semibold">AI Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent task recommendations based on your workflow.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h3 className="font-semibold">Stay Organized</h3>
            <p className="text-sm text-muted-foreground">
              Track progress with summaries, filters, and priorities.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
