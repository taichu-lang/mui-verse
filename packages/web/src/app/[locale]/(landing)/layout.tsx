"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { useEffect, useRef, useState } from "react";
import { Footer } from "./_blocks/Footer";
import { Navbar } from "./_blocks/Navbar";

export default function LandingLayout({
  children,
}: {
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
          "bg-white/80 backdrop-blur-xs backdrop-saturate-150 transition-all duration-300":
            scrolled,
          "bg-white": !scrolled,
        })}
      >
        <Navbar />
      </div>
      {children}
      <Footer />
    </div>
  );
}
