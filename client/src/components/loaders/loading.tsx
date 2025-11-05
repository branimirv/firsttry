import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
};

export const Loading = ({ className, size = "md", text }: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size]
        )}
        aria-label="Loading"
        role="status"
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

/**
 * Full-page loading component
 */
export const LoadingPage = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" text={text} />
    </div>
  );
};
