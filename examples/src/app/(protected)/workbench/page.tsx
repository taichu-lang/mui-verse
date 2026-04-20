"use client";

import { useAuth } from "@/auth/auth";
import { AirwallexCard } from "@mui-verse/payment/airwallex";
import { NumberField, TextField } from "@mui-verse/ui/components/inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const [num, setNum] = useState<number>(0);
  const { session } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4">
      <Typography variant="h1" component={"h1"}>
        An example of mui-verse
      </Typography>
      <DropdownMenu side="bottom">
        <DropdownMenuTrigger>
          <Button>{session?.email}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Box height={1024} display={"flex"} flexDirection={"column"}>
        {value}
        <TextField
          required
          onValueChange={setValue}
          validator={{
            fn: (v) => {
              if (v.length < 6) {
                return "too short";
              }

              if (v.length > 10) {
                return "too long";
              }

              return null;
            },
          }}
        />
        {num}
        <NumberField onValueChange={setNum} />
        <AirwallexCard
          locale="en"
          order={{
            order_id: "1",
            payment_id: "123",
            type: "embedded",
            embedded: { client_secret: "123" },
          }}
        />
      </Box>
    </div>
  );
}
