"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function UsageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="w-usage-width mx-auto mt-10 flex h-full flex-col">
      <Button
        variant="outlined"
        size="small"
        onClick={() => router.back()}
        className="w-fit"
      >
        Back
      </Button>
      <div className="mt-6 mb-2 flex items-center gap-3.5">
        <p className="py-2.5 text-lg font-semibold">Credits usage history</p>
      </div>
      <div className="mb-10 overflow-y-auto">{children}</div>
    </div>
  );
}
