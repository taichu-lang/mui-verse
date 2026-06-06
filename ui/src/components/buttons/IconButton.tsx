import { cn } from "@mui-verse/ui/utils/cn";

export function IconTextButton({
  ref,
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "hover:shadow-button-hover cursor-pointer rounded-full p-1.5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
