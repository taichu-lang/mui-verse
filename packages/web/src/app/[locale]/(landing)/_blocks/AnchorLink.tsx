import { cn } from "@mui-verse/ui/utils/cn";

export function AnchorLink({
  href,
  children,
  active = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-block w-fit",
        {
          "font-semibold": active,
        },
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <span className="bg-text-secondary absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-300 ease-in-out group-hover:w-full" />
    </a>
  );
}
