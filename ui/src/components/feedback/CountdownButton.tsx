"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { Button, ButtonProps } from "@mui/material";
import { useEffect, useState } from "react";

const PERSISTENT_KEY = "countdown_duration";
const persistentCountdown = (countdown: number) => {
  if (typeof window === "undefined") {
    return;
  }

  if (countdown > 0) {
    const expiration = Date.now() / 1000 + countdown;
    localStorage.setItem(PERSISTENT_KEY, expiration.toString());
  } else {
    localStorage.removeItem(PERSISTENT_KEY);
  }
};

export type CountdownButtonProps = {
  initialCountdown?: number;
  autoStart?: boolean;
} & ButtonProps;

export const CountdownButton = ({
  initialCountdown = 60,
  autoStart = false,
  children,
  onClick,
  className,
  ...props
}: CountdownButtonProps) => {
  const [countdown, setCountdown] = useState<number>(
    autoStart ? initialCountdown : 0,
  );

  // Avoid the following error:
  // Hydration failed because the server rendered text didn't match the client.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PERSISTENT_KEY);
      if (saved) {
        const remaining = Math.floor(parseInt(saved) - Date.now() / 1000);
        if (remaining > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCountdown(remaining);
        }
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    persistentCountdown(countdown);

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCountdown(initialCountdown);
    onClick?.(e);
  };

  return (
    <Button
      variant="text"
      onClick={handleClick}
      disabled={isHydrated && countdown > 0}
      className={cn("w-fit p-0 hover:bg-transparent", className)}
      {...props}
    >
      <div className="text-sm underline">
        {children}
        {` (${countdown || initialCountdown})`}
      </div>
    </Button>
  );
};
