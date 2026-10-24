export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="size-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs text-muted-foreground font-medium animate-pulse">
        Loading Kasirize...
      </p>
    </div>
  );
}
