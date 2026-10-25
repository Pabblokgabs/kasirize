import { cn } from "cn";
import { Skeleton } from "../ui/skeleton";

export default function SkeletonTemplate({
  className,
}: {
  className?: string;
}) {
  return <Skeleton className={cn(className, "bg-neutral-200")} />;
}
