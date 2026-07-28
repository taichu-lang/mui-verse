import { Button } from "@/components/ui/Button";
import { Divider } from "@mui/material";
import { MailIcon } from "lucide-react";
import { AnchorLink } from "./AnchorLink";

export function Footer() {
  return (
    <div className="w-full bg-white">
      <div className="w-landing-width mx-auto flex h-35 items-center">
        <Divider flexItem orientation="vertical" />
        <p className="ml-12.5 text-4xl font-medium">
          One tab. Endless possibilities.
        </p>
        <div className="flex-1" />
        <Button color="dark" className="mr-12.5 px-3 py-1.5">
          Get started
        </Button>
        <Divider flexItem orientation="vertical" />
      </div>
      <Divider flexItem />
      <div className="w-landing-width mx-auto mt-15 mb-10 grid grid-cols-[5fr_3.5fr_3.5fr]">
        <div className="flex flex-col">
          <p className="text-base font-medium">Anna</p>
          <div className="mt-7.5 flex items-center gap-2">
            <MailIcon className="h-4 w-4" strokeWidth={"1.2"} />
            <span className="text-sm">developer@platomaster.com</span>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <AnchorLink href="/#product" className="text-sm">
            Product
          </AnchorLink>
          <AnchorLink href="/#capabilities" className="text-sm">
            Capabilities
          </AnchorLink>
          <AnchorLink href="/#faq" className="text-sm">
            FAQ
          </AnchorLink>
          <AnchorLink href="/pricing" className="text-sm">
            Pricing
          </AnchorLink>
        </div>
        <div className="flex flex-col gap-5">
          <AnchorLink href="/privacy" className="text-sm">
            Privacy Policy
          </AnchorLink>
          <AnchorLink href="/tos" className="text-sm">
            Terms of Service
          </AnchorLink>
          <AnchorLink href="/refund" className="text-sm">
            Refund Policy
          </AnchorLink>
        </div>
      </div>
      <div className="w-landing-width mx-auto pb-7.5">
        <Divider flexItem />
        <p className="mt-5 text-sm">
          © 2026 Plato Master Technology Inc. All rights reserved
        </p>
      </div>
    </div>
  );
}
