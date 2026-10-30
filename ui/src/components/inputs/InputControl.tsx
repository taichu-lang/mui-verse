"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Input as BaseInput,
  type InputProps as BaseInputProps,
} from "./TextField";

type ValidatorFn = (value: string) => boolean;

type Phase = "idle" | "validating";

interface InputControlContextValue {
  value: string;
  phase: Phase;
  hasError: boolean;
  registerRule: (fn: ValidatorFn) => () => void;
  handleValueChange: (value: string) => void;
  handleBlur: () => void;
}

export type InputControlRef = {
  /**
   * Run all registered validation rules against the current value.
   * Updates the visual error state and returns `true` when every rule passes.
   */
  check: () => boolean;

  /**
   * External error.
   */
  setError: () => void;
};

const InputControlContext = createContext<InputControlContextValue | null>(
  null,
);

export function useInputControl() {
  const ctx = useContext(InputControlContext);
  if (!ctx) {
    throw new Error(
      "InputLabel/FormInput/InputRule must be used inside <InputControl>",
    );
  }
  return ctx;
}

export interface InputControlProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onError?: () => void;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<InputControlRef>;
}

export function InputControl({
  defaultValue = "",
  onValueChange,
  onError,
  className,
  children,
  ref,
}: InputControlProps) {
  const [value, setValue] = useState(defaultValue);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hasError, setHasError] = useState(false);
  const rulesRef = useRef<Set<ValidatorFn>>(new Set());

  const registerRule = useCallback((fn: ValidatorFn) => {
    rulesRef.current.add(fn);
    return () => {
      rulesRef.current.delete(fn);
    };
  }, []);

  const handleValueChange = useCallback(
    (v: string) => {
      setValue(v);
      setPhase("idle");
      setHasError(false);
      onValueChange?.(v);
    },
    [onValueChange],
  );

  const check = useCallback(() => {
    let anyFailed = false;
    for (const fn of rulesRef.current) {
      if (!fn(value)) {
        anyFailed = true;
        break;
      }
    }
    setPhase("validating");
    setHasError(anyFailed);
    if (anyFailed) {
      onError?.();
    }
    return !anyFailed;
  }, [onError, value]);

  const setError = useCallback(() => {
    setHasError(true);
  }, []);

  useImperativeHandle(ref, () => ({ check, setError }), [check, setError]);

  const ctx = useMemo<InputControlContextValue>(
    () => ({
      value,
      phase,
      hasError,
      registerRule,
      handleValueChange,
      handleBlur: check,
    }),
    [value, phase, hasError, registerRule, handleValueChange, check],
  );

  return (
    <InputControlContext.Provider value={ctx}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </InputControlContext.Provider>
  );
}

export function InputLabel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("mb-2.5 text-start text-base", className)} {...rest}>
      {children}
    </span>
  );
}

export type InputControlInputProps = Omit<
  BaseInputProps,
  "value" | "defaultValue" | "onValueChange" | "onBlur" | "onChange" | "error"
>;

export function FormInput(props: InputControlInputProps) {
  const { handleValueChange, handleBlur, hasError } = useInputControl();
  return (
    <BaseInput
      {...props}
      onValueChange={handleValueChange}
      onValueComplete={handleBlur}
      error={hasError}
    />
  );
}

export interface InputRuleProps {
  fn: ValidatorFn;
  visible?: "auto" | "always";
  className?: string;
  children?: React.ReactNode;
}

export function InputRule({
  fn,
  visible = "auto",
  className,
  children,
}: InputRuleProps) {
  const { value, phase, registerRule } = useInputControl();

  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return registerRule((v) => fnRef.current(v));
  }, [registerRule]);

  const isError = phase === "validating" && !fn(value);
  const shouldShow = visible === "always" || isError;
  if (!shouldShow) {
    return null;
  }

  return (
    <span
      className={cn(
        "text-text-secondary text-sm",
        isError && "text-error-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FormError({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("text-error-500 text-sm", className)}>{children}</span>
  );
}
