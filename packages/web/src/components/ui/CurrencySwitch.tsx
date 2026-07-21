"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useDropdownMenu,
} from "@mui-verse/ui/components/navigation";
import { CheckIcon } from "lucide-react";
import { Dot } from "./Dot";
import { CurrencyCode } from "@/lib/types/currency";

function Indicator() {
  const { open } = useDropdownMenu();

  return (
    <ChevronDownIcon
      className={open ? "rotate-180 transition-transform duration-150" : ""}
    />
  );
}

function Item({ value }: { value: CurrencyCode }) {
  const { currency, updateCheckout } = useCheckout();
  const selected = currency === value;

  return (
    <DropdownMenuItem
      selected={selected}
      className="flex px-2.5 py-2 text-sm"
      onClick={() => updateCheckout({ currency: value })}
    >
      {value}
      {selected && <CheckIcon className="h-4 w-4" />}
    </DropdownMenuItem>
  );
}

export function CurrencySwitch() {
  const { currency } = useCheckout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex h-8 cursor-pointer items-center rounded-full bg-white pr-2 pl-3 shadow-(--mui-shadow-border)">
          <Dot />
          <span className="mr-1 ml-2 text-sm">{currency}</span>
          <Indicator />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent sx={{ minWidth: "auto", width: "94px", mt: "6px" }}>
        <Item value="RUB" />
        <Item value="USD" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
