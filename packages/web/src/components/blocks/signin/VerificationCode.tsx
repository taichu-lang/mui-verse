import { sendOtpCode, verifyOtpCode } from "@/lib/apis/otp";
import { signinWithCode } from "@/lib/apis/profile";
import { CountdownButton } from "@mui-verse/ui/components/feedback";
import { Input } from "@mui-verse/ui/components/inputs";
import { Button } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { SignCard } from "./SignCard";
import { apiCodeCredentialError } from "@/lib/types/api";
import toast from "react-hot-toast";

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
}: {
  email: string;
  onLogin?: () => void;
  onCodeChecked?: (token: string) => void;
  className?: string;
}) {
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

    // TODO
    await verifyOtpCode(email, code);
  };

  const handleLogin = async () => {
    if (!onLogin || !code) {
      return;
    }

    try {
      const response = await signinWithCode(email, code);
      if (response.code === apiCodeCredentialError) {
        setError(true);
      } else {
        onLogin();
      }
    } catch {
      toast.error("network error");
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
      <span className="mt-6 text-center text-[26px] leading-7.5 font-medium">
        Check your inbox
      </span>
      <span className="mt-9 text-center text-sm">
        Enter the verification code we just sent to {email}
      </span>
      <Input
        placeholder="Enter your verification code"
        className="mt-7"
        size="medium"
        onValueChange={handleCodeChange}
        autoComplete="off"
      />
      <div className="mt-3 flex items-center">
        {error && (
          <span className="text-error-500 text-sm">
            Invalid verification code
          </span>
        )}
        <div className="flex-1"></div>
        <CountdownButton autoStart>Resend</CountdownButton>
      </div>
      <Button
        className="mt-3.5 py-2.5 text-base"
        loading={isPending}
        onClick={handleSubmit}
        disabled={!code || code.length !== 4}
      >
        Continue
      </Button>
    </SignCard>
  );
}
