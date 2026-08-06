import { useRouter } from "next/navigation";
import { useAuth } from "./auth";
import { cn } from "@mui-verse/ui/utils/cn";

export function AuthZone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const hasAuthorization = useAuth.useHasAuthorization();

  if (hasAuthorization) {
    return children;
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="z-navbar absolute inset-0 cursor-pointer bg-transparent"
        role="button"
        tabIndex={0}
        onClick={() => router.push("/signin")}
      />
      {children}
    </div>
  );
}
