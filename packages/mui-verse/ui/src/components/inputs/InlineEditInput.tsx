"use client";

import { InputBase, InputBaseProps } from "@mui/material";
import { useState } from "react";

export function InlineEditInput({
  defaultValue,
  onSubmit,
  ...props
}: Omit<InputBaseProps, "value" | "onSubmit"> & {
  onSubmit?: (value: unknown) => void;
}) {
  const [value, setValue] = useState<unknown>(defaultValue);
  const [focused, setFocused] = useState<boolean>(false);

  const handleBlur = () => {
    setFocused(false);
    onSubmit?.(value);
  };

  return (
    <InputBase
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      {...props}
      autoFocus={false}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      sx={{
        "& .MuiInputBase-input::first-line": {
          bgcolor: focused ? "transparent" : "primary.light",
        },
      }}
    />
  );
}
