"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-landing-width mx-auto flex h-full items-center">
      <p className="text-base font-medium">Anna</p>
      <div className="flex flex-1 justify-center gap-11.5">
        <Link className="text-base" href={"#product"}>
          Product
        </Link>
        <Link className="text-base" href={"#capabilities"}>
          Capabilities
        </Link>
        <Link className="text-base" href={"/pricing"}>
          Pricing
        </Link>
        <Link className="text-base" href={"#support"}>
          Support
        </Link>
      </div>
      <div className="flex gap-5.25">
        <Button className="bg-text-primary px-3 py-1.5 text-white">
          Get started
        </Button>
      </div>
    </div>
  );
}
