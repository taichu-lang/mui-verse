"use client";

import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextProps,
} from "@mui/material";
import { useState } from "react";

// Refer to ValidityState.
//
// Ex:
// - input type is 'number', value is '-1-1' => badInput.
// - input type is 'number' and min is 1, value is '-1' => rangeUnderflow.
// - input type is 'number' and max is 10, value is '11' => rangeOverflow.
export type TextValidationState =
  | "valueMissing"
  | "typeMismatch"
  | "patternMismatch"
  | "tooLong"
  | "tooShort"
  | "rangeUnderflow"
  | "rangeOverflow"
  | "stepMismatch"
  | "badInput";

export interface TextValidator {
  /**
   * Custom validation.
   *
   * @param value The value of input field.
   * @returns The error message if the value is invalid, or null if it is valid.
   */
  fn?: (value: string) => string | null;

  /**
   * Validation rules based on HTML5 constraint validation. Value is the error
   * message to render.
   */
  rules?: Partial<Record<TextValidationState, string>>;
}

export type TextFieldProps = MuiTextProps & {
  onValueChange?: (value: string) => void;
  validator?: TextValidator;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  readonly?: boolean;
};

export function TextField(props: TextFieldProps) {
  const {
    onValueChange,
    validator,
    startIcon,
    endIcon,
    readonly,
    helperText,
    label,
    slotProps,
    value,
    defaultValue, // 'defaultValue' is uncontrolled component in react, discard it.
    ...otherProps
  } = props;

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>((value as string) ?? "");

  if (defaultValue && defaultValue != inputValue) {
    setInputValue(defaultValue as string);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let error = null;
    let hasError = false;

    // Get HTML5 constraint validation.
    const input = e.target as HTMLInputElement;
    if (!input.validity.valid) {
      const invalidKey = Object.keys(ValidityState.prototype).find(
        (key) => key !== "valid" && input.validity[key as keyof ValidityState],
      );
      if (invalidKey) {
        hasError = true;
        error = validator?.rules?.[invalidKey as TextValidationState];
      }
    }

    const value = e.target.value;
    if (!error) {
      error = validator?.fn?.(value) || null;
    }

    if (hasError) {
      setErrorMsg(error || "");
      // Notify user about the value is invalid.
      onValueChange?.("");
    } else {
      // Clear the error if the value is valid.
      setErrorMsg("");
      onValueChange?.(value);
    }

    // No matter whether the value is valid or not, update the display.
    setInputValue(value);
  };

  const buildLabel = () => {
    if (label) {
      return label;
    }

    if (otherProps.required) {
      return "Required";
    }

    return null;
  };

  const buildSlotProps = () => {
    let input = slotProps?.input ?? {};
    input = {
      ...input,
      className: "rounded-[8px]",
    };

    if (readonly) {
      input = {
        ...input,
        readOnly: true,
      };
    }

    if (startIcon) {
      input = {
        ...input,
        startAdornment: (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
      };
    }

    if (endIcon) {
      input = {
        ...input,
        endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
      };
    }

    return {
      ...slotProps,
      input,
    };
  };

  return (
    <MuiTextField
      {...otherProps}
      name={otherProps.id} // Using for the field name in FormData.
      value={inputValue}
      onChange={handleChange}
      error={!!errorMsg}
      helperText={errorMsg || helperText}
      label={buildLabel()}
      slotProps={buildSlotProps()}
    />
  );
}
