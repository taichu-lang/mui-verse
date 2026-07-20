"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { useEffect, useRef, useState } from "react";

export default function LandingLayout({
  navbar,
  children,
}: {
  navbar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = scrollRef.current;
    if (!target) {
      return;
    }

    const handleScroll = () => {
      setScrolled(target.scrollTop > 20);
    };
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="bg-background-gray h-full w-full overflow-x-hidden overflow-y-auto"
      ref={scrollRef}
    >
      <div
        className={cn("h-landing-navbar z-navbar sticky top-0 w-full", {
          "bg-white/80 backdrop-blur-lg transition-all duration-300": scrolled,
          "bg-white": !scrolled,
        })}
      >
        {navbar}
      </div>
      {children}
    </div>
  );
}
