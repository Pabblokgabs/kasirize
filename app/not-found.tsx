import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
        Page Not Found (404)
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        The page, task gig, or opportunity profile you are looking for does not
        exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Link href="/" className={buttonVariants({ variant: "default" })}>
          <ArrowLeft className="size-4 mr-2" /> Back to Kasirize Home
        </Link>
      </div>
    </div>
  );
}
