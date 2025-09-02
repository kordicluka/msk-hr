import { cn } from "@/lib/utils";

function AdminHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex h-14 relative w-full justify-between items-center px-4",
        className
      )}
      {...props}
    />
  );
}

function AdminHeaderCenter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 flex justify-center px-10 gap-2",
        className
      )}
      {...props}
    />
  );
}

function AdminHeaderLeft({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props} />
  );
}

function AdminHeaderRight({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props} />
  );
}

export { AdminHeader, AdminHeaderLeft, AdminHeaderCenter, AdminHeaderRight };
