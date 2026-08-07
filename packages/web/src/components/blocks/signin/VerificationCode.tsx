import { Button } from "@/components/ui/Button";
import { sendOtpCode, verifyOtpCode } from "@/lib/apis/otp";
import { signinWithCode } from "@/lib/apis/profile";
import { apiCodeCredentialError } from "@/lib/types/api";
import { CountdownButton } from "@mui-verse/ui/components/feedback";
import { Input } from "@mui-verse/ui/components/inputs";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { SignCard } from "./SignCard";
import { Title } from "./Title";
import { useTranslations } from "next-intl";

/**
 * This component is used for code verification in the following two cases:
 * - Login, from the signin page or after payment successful.
 * - Email verification, from setting or changing password.
 *
 * So we use two different callback functions to handle the success case.
 *
 * @param onLogin Pass the callback function in login case, we will call the
 * signin api with `email` and `code`.
 *
 * @param onCodeChecked Pass this callback function in email verification case.
 * We will call the verification api with `email` and `code`.
 *
 * Either `onLogin` or `onCodeChecked` should be provided.
 */
export function VerificationCode({
  email,
  onLogin,
  onCodeChecked,
  children,
}: {
  email: string;
  onLogin?: () => void;
  onCodeChecked?: (token: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    startTransition(async () => {
      await sendOtpCode(email);
    });
  }, [email]);

  if (!onLogin && !onCodeChecked) {
    throw new Error("onLogin or onCodeChecked should be provided");
  }

  const handleCodeChange = (v: string) => {
    setCode(v);
    if (error) {
      setError(false);
    }
  };

  const handleVerification = async () => {
    if (!onCodeChecked || !code) {
      return;
    }

    try {
      const response = await verifyOtpCode(email, code);
      switch (response.code) {
        case 0:
          onCodeChecked(response.data);
          break;

        case apiCodeCredentialError:
          setError(true);
          break;

        default:
          toast.error(t("error.system"));
          break;
      }
    } catch {
      toast.error(t("error.network"));
    }
  };

  const handleLogin = async () => {
    if (!onLogin || !code) {
      return;
    }

    try {
      const response = await signinWithCode(email, code);
      if (response === apiCodeCredentialError) {
        setError(true);
      } else {
        onLogin();
      }
    } catch {
      toast.error(t("error.network"));
    }
  };

  const handleSubmit = () => {
    if (!code) {
      return;
    }

    startTransition(async () => {
      if (onLogin) {
        await handleLogin();
      } else {
        await handleVerification();
      }
    });
  };

  return (
    <SignCard>
      <Title>{t("sign.verification.title")}</Title>
      <span className="mt-9 text-center text-sm">
        {t("sign.verification.tips", { email })}
      </span>
      <Input
        placeholder={t("sign.verification.placeholder")}
        className="mt-7"
        size="medium"
        onValueChange={handleCodeChange}
        autoComplete="off"
      />
      <div className="mt-3 flex items-center">
        {error && (
          <span className="text-error-500 text-sm">
            {t("sign.verification.error")}
          </span>
        )}
        <div className="flex-1"></div>
        <CountdownButton autoStart>
          {t("sign.verification.resend")}
        </CountdownButton>
      </div>
      <Button
        className="mt-3.5"
        loading={isPending}
        onClick={handleSubmit}
        disabled={!code || code.length !== 4}
      >
        {t("sign.verification.submit")}
      </Button>
      {children}
    </SignCard>
  );
}
