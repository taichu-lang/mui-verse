import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { cn } from "@mui-verse/ui/utils/cn";
import Link from "next/link";

export function FreePlanButton({ className }: { className?: string }) {
  const { session } = useAuth();
  const title =
    session?.plan_code === "pro" ? "Already included" : "Get started";

  return (
    <Button
      LinkComponent={Link}
      size="small"
      fullWidth
      variant="outlined"
      className={className}
      href={session ? "/chat" : "/signin"}
    >
      {title}
    </Button>
  );
}

export function ProPlanButton({ className }: { className?: string }) {
  const { session } = useAuth();
  const title = session?.plan_code === "pro" ? "Extend" : "Buy now";

  return (
    <Button
      LinkComponent={Link}
      size="small"
      fullWidth
      className={cn("from-primary-500 bg-linear-to-r to-[#27B2E5]", className)}
      href={session ? "/checkout" : "/signin"}
    >
      {title}
    </Button>
  );
}
