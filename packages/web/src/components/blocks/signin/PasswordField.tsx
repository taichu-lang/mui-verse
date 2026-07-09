"use client";

import { EyeOff, EyeOn } from "@/components/icons";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { Input } from "@mui-verse/ui/components/inputs";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import { useImperativeHandle, useState } from "react";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "lengthRule")
  .max(20, "lengthRule")
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: "charRule",
  })
  .refine((value) => /\d/.test(value), {
    message: "charRule",
  });

function checkPassword(password: string): string | null {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues;
      return issues[issues.length - 1].message;
    }

    return err as string;
  }
}

const rules = ["lengthRule", "charRule"];

export type PasswordFieldRef = {
  check: () => boolean;
};

export function PasswordField({
  label,
  onChange,
  className,
  enableRules = false,
  ref,
}: {
  label: string;
  onChange: (value: string) => void;
  className?: string;
  enableRules?: boolean;
  ref?: React.Ref<PasswordFieldRef>;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const t = useTranslations();

  const handleChange = (v: string) => {
    setPassword(v);
    onChange(v);
    if (error) {
      setError(null);
    }
  };

  const check = () => {
    if (!enableRules) return true;
    const err = checkPassword(password);
    if (err) {
      setError(err);
      onChange("");
      return false;
    }
    return true;
  };

  useImperativeHandle(ref, () => ({ check }));

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-start text-base leading-5">{label}</span>
      <Input
        type={visible ? "text" : "password"}
        placeholder="Enter your password"
        size="medium"
        endIcon={
          <IconGhostButton onClick={() => setVisible(!visible)}>
            {visible ? (
              <EyeOn className="h-4.5 w-4.5" />
            ) : (
              <EyeOff className="h-4.5 w-4.5" />
            )}
          </IconGhostButton>
        }
        className="mt-2.5 mb-3"
        onValueChange={handleChange}
        onBlur={check}
        error={!!error}
      />
      {enableRules && (
        <>
          {rules.map((rule) => (
            <span
              key={rule}
              className={cn("text-text-secondary text-sm", {
                "text-error-500": rule === error,
              })}
            >
              {t(`sign.password.${rule}`)}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
