"use client";

import { checkPassword } from "@/lib/schema";
import {
  FormInput,
  InputControl,
  InputControlRef,
  InputLabel,
  InputRule,
} from "@mui-verse/ui/components/inputs";
import { useTranslations } from "next-intl";

export function DefaultPasswordField({
  label,
  className,
  onChange,
  ref,
}: {
  label?: string;
  className?: string;
  onChange: (value: string) => void;
  ref?: React.Ref<InputControlRef>;
}) {
  const t = useTranslations();

  return (
    <InputControl className={className} onValueChange={onChange} ref={ref}>
      <InputLabel>{label ?? "Password"}</InputLabel>
      <FormInput
        type="password"
        size="medium"
        placeholder="Enter your password"
      />
      <InputRule
        fn={(value) => checkPassword(value) !== "lengthRule"}
        visible="always"
        className="mt-3"
      >
        {t(`sign.password.lengthRule`)}
      </InputRule>
      <InputRule
        fn={(value) => checkPassword(value) !== "charRule"}
        visible="always"
      >
        {t(`sign.password.charRule`)}
      </InputRule>
    </InputControl>
  );
}
