"use client";

import { useState } from "react";
import { TextField, TextFieldProps } from "./TextField";

export type NumberFieldProps = TextFieldProps & {
  min?: number;
  max?: number;
  onValueChange?: (v: number) => void;
};

export function NumberField(props: NumberFieldProps) {
  const { min, max, onValueChange, ...otherProps } = props;
  const [parsedNumber, setParsedNumber] = useState<number | null>(null);

  const handleNumberChange = (v: string) => {
    if (v === "") {
      setParsedNumber(null);
      onValueChange?.(0);
      return;
    }

    const value = Number(v);
    if (isNaN(value)) {
      return;
    }

    setParsedNumber(value);
    onValueChange?.(value);
  };

  return (
    <TextField
      slotProps={{
        input: {
          type: "number",
          inputProps: {
            min: min,
            max: max,
          },
        },
      }}
      defaultValue={parsedNumber && parsedNumber.toString()}
      onValueChange={handleNumberChange}
      {...otherProps}
    />
  );
}
