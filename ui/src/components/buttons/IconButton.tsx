import { cn } from "@mui-verse/ui/utils/cn";

type IconTextButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

export function IconTextButton({
  ref,
  children,
  className,
  ...rest
}: IconTextButtonProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "hover:shadow-button-hover shrink-0 cursor-pointer rounded-full p-1.5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function IconSquareButton({ className, ...props }: IconTextButtonProps) {
  return (
    <IconTextButton
      {...props}
      className={cn("aspect-square shrink-0 rounded-lg", className)}
    />
  );
}

export function IconGhostButton({
  ref,
  children,
  className,
  ...rest
}: IconTextButtonProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center rounded-lg",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
