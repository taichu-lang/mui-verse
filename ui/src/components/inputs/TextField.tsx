"use client";

import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  Divider,
  InputAdornment,
  InputBase,
  InputBaseProps,
  TextField as MuiTextField,
  TextFieldProps as MuiTextProps,
} from "@mui/material";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useImperativeHandle, useRef, useState } from "react";

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
          <InputAdornment position="start" sx={{ p: 0, m: 0 }}>
            {startIcon}
          </InputAdornment>
        ),
      };
    }

    if (endIcon) {
      input = {
        ...input,
        endAdornment: (
          <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
            {endIcon}
          </InputAdornment>
        ),
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

export type InputProps = Omit<InputBaseProps, "value"> & {
  onValueChange?: (value: string) => void;
  onValueComplete?: (value: string) => void;
  variant?: "default" | "outlined";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  ref?: React.Ref<InputHandle>;
};

export interface InputHandle {
  reset: () => void;
}

export function Input({
  defaultValue,
  onValueChange,
  onValueComplete,
  size = "small",
  variant = "outlined",
  type: defaultType = "text",
  startIcon,
  endIcon,
  className,
  autoCapitalize = "none",
  autoComplete = "on",
  autoCorrect = "off",
  spellCheck = "false",
  error = false,
  ref,
  ...props
}: InputProps) {
  const [value, setValue] = useState<string>((defaultValue as string) ?? "");
  const [type, setType] = useState<string>(defaultType);
  const isComposingRef = useRef(false);

  const classes = {
    small: "text-sm leading-4.5 py-2.25 px-3",
    medium: "text-sm leading-4.5 py-3.25 px-4",
    default: "hover:ring-text-primary text-sm leading-4.5",
    outlined:
      "ring-divider ring-1 ring-inset hover:ring-text-primary focus-within:ring-text-primary",
  };

  const reset = useCallback(() => {
    const value = (defaultValue as string) ?? "";
    setValue(value);
    onValueChange?.(value);
    onValueComplete?.(value);
  }, [defaultValue, onValueChange, onValueComplete]);

  useImperativeHandle(ref, () => ({ reset }));

  const buildEndIcon = () => {
    if (endIcon) {
      return endIcon;
    }

    if (defaultType === "password") {
      return (
        <IconGhostButton
          onClick={() =>
            setType((prev) => (prev === "text" ? "password" : "text"))
          }
        >
          {type === "password" ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </IconGhostButton>
      );
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);

    if (!isComposingRef.current) {
      onValueChange?.(v);
    }
  };

  const handleBlur = () => {
    onValueComplete?.(value);
  };

  // IME composition (e.g. Chinese Pinyin, Japanese Kana, Korean Hangul) fires
  // `onChange` events for each intermediate keystroke before the user commits a
  // character. Forwarding those transient values via `onValueChange` causes
  // downstream consumers — debounced searches, network requests, validators —
  // to react to text the user has not actually confirmed yet.
  //
  // We swallow `onValueChange` while composition is active and emit a single
  // final value on `compositionend`. The visible input value is still updated
  // on every change so the IME candidate UI keeps working normally.
  //
  // Consumers that genuinely need the in-flight composition text (custom
  // candidate panels, collaborative cursors, typing analytics, full-fledged
  // editors) should not rely on this component and read composition events
  // directly instead.
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
    isComposingRef.current = false;
    onValueChange?.((e.target as HTMLInputElement).value);
  };

  return (
    <InputBase
      {...props}
      value={value}
      type={type}
      className={cn(
        "rounded-[10px]",
        classes[size],
        classes[variant],
        {
          "ring-error-500 hover:ring-error-500 focus-within:ring-error-500":
            error,
        },
        className,
      )}
      onChange={handleChange}
      onBlur={handleBlur}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      startAdornment={
        startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        )
      }
      endAdornment={
        <InputAdornment position="end">{buildEndIcon()}</InputAdornment>
      }
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
    />
  );
}

export function InputGroup({
  children,
  error = false,
  ...props
}: {
  children: React.ReactNode;
} & InputProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-[10px]",
        "ring-divider hover:ring-text-primary focus-within:ring-text-primary ring-1 ring-inset",
        {
          "ring-error-500 hover:ring-error-500 focus-within:ring-error-500":
            error,
        },
      )}
    >
      {children}
      <Divider flexItem orientation="vertical" />
      <Input {...props} variant="default" />
    </div>
  );
}
