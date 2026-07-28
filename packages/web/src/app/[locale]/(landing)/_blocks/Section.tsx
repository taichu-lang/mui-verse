import { cn } from "@mui-verse/ui/utils/cn";

export function Section({
  id,
  white = false,
  children,
}: {
  id?: string;
  white?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-landing-navbar flex justify-center", {
        "bg-white": white,
      })}
    >
      <div className="w-landing-width mt-12.5 mb-15 flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}
