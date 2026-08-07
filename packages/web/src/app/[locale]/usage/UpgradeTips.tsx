"use client";

import { useAuth } from "@/auth/auth";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const key = "x-usage-upgrade-hidden";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): boolean {
  return localStorage.getItem(key) === "1";
}

function getServerSnapshot(): boolean {
  return true;
}

function hide() {
  localStorage.setItem(key, "1");
  listeners.forEach((l) => l());
}

export function UpgradeTips() {
  const t = useTranslations();
  const session = useAuth((s) => s.session);
  const hidden = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (hidden || session?.subscription.plan_code !== "free") {
    return null;
  }

  return (
    <div className="text-text-secondary bg-action-hover flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-sm">
      {t.rich("usage.upgrade", {
        link: (chunks) => {
          return (
            <Link href={"/checkout"} className="underline">
              {chunks}
            </Link>
          );
        },
      })}
      <IconGhostButton onClick={hide}>
        <XIcon className="h-4.5 w-4.5" strokeWidth={1.2} />
      </IconGhostButton>
    </div>
  );
}
