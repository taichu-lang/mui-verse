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
  className,
  onChange,
  ref,
}: {
  className?: string;
  onChange: (value: string) => void;
  ref?: React.Ref<InputControlRef>;
}) {
  const t = useTranslations();

  return (
    <InputControl className={className} onValueChange={onChange} ref={ref}>
      <InputLabel>{t("sign.password.label")}</InputLabel>
      <FormInput
        type="password"
        size="medium"
        placeholder={t("sign.password.placeholder")}
      />
      <InputRule
        fn={(value) => checkPassword(value) !== "lengthRule"}
        visible="always"
        className="mt-3"
      >
        {t(`sign.password.ruleLength`)}
      </InputRule>
      <InputRule
        fn={(value) => checkPassword(value) !== "charRule"}
        visible="always"
      >
        {t(`sign.password.ruleChar`)}
      </InputRule>
    </InputControl>
  );
}
