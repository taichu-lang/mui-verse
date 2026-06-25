"use client";

import { TextField, TextFieldProps } from "./TextField";

export type NumberFieldProps = Omit<TextFieldProps, "onValueChange"> & {
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (v: number) => void;
};

export function NumberField(props: NumberFieldProps) {
  const { min, max, step, onValueChange, ...otherProps } = props;

  const handleNumberChange = (v: string) => {
    if (v === "") {
      onValueChange?.(0);
      return;
    }

    // If the input is not a number, for example: "-1.2-", the validation of
    // TextField will be failed, then the param `v` will be empty. So, the
    // `value` here can not be NaN.
    const value = Number(v);
    onValueChange?.(value);
  };

  return (
    <TextField
      type="number"
      slotProps={{
        input: {
          inputProps: {
            min: min,
            max: max,
            step: step ?? "any",
          },
        },
      }}
      onValueChange={handleNumberChange}
      {...otherProps}
    />
  );
}
