"use client";

import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextProps,
} from "@mui/material";
import { useRef, useState } from "react";

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

interface InputError {
  hasError: boolean;
  message: string | null;
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
    type,
    autoCapitalize = "none",
    autoComplete = "off",
    autoCorrect = "off",
    spellCheck = "false",
    ...otherProps
  } = props;

  const [inputValue, setInputValue] = useState<string>((value as string) ?? "");
  // Might be changed during each change event.
  const lastValidationResult = useRef<InputError | null>(null);
  // Re-render ui on blur.
  const [validation, setValidation] = useState<InputError | null>(null);

  const doValidate = (e: React.ChangeEvent<HTMLInputElement>): InputError => {
    let message = null;
    let hasError = false;

    // Get HTML5 constraint validation.
    const input = e.target as HTMLInputElement;
    if (!input.validity.valid) {
      const invalidKey = Object.keys(ValidityState.prototype).find(
        (key) => key !== "valid" && input.validity[key as keyof ValidityState],
      );
      if (invalidKey) {
        console.log(invalidKey);
        hasError = true;
        message = validator?.rules?.[invalidKey as TextValidationState] || null;
      }
    }

    const value = e.target.value;
    if (!message) {
      const error = validator?.fn?.(value);
      if (error) {
        message = error;
        hasError = true;
      }
    }

    return {
      hasError,
      message,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validation) {
      setValidation(null);
    }

    const result = doValidate(e);
    lastValidationResult.current = result;

    const value = e.target.value;
    if (result.hasError) {
      // Reset the value that user owned to clear the error input.
      onValueChange?.("");
    } else {
      onValueChange?.(value);
    }

    // No matter whether the value is valid or not, update the display.
    setInputValue(value);
  };

  const handleBlur = () => {
    if (lastValidationResult.current?.hasError) {
      setValidation(lastValidationResult.current);
    } else {
      // If the input type is number, we should convert the input to Number to
      // trim the trailing zeros. Ex:
      //
      // - "01" => 1
      // - "1.0" => 1
      // - "-01" => -1
      //
      // Note that this conversation can not be done during change event.
      if (type === "number") {
        const num = Number(inputValue);
        setInputValue(num.toString());
      }
    }
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
      ...(type === "number" && { inputMode: "numeric", type: "number" }),
      ...(readonly && { readOnly: true }),
    };

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

    let htmlInput = slotProps?.htmlInput ?? {};
    htmlInput = {
      ...htmlInput,
      autoCapitalize,
      autoComplete,
      autoCorrect,
      spellCheck,
    };

    return {
      ...slotProps,
      input,
      htmlInput,
    };
  };

  return (
    <MuiTextField
      {...otherProps}
      name={otherProps.id} // Using for the field name in FormData.
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={validation?.hasError}
      helperText={validation?.message || helperText}
      label={buildLabel()}
      type={type === "number" ? "text" : type}
      slotProps={buildSlotProps()}
    />
  );
}
