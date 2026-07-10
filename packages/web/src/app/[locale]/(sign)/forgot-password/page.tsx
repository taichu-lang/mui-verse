"use client";

import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { Button } from "@/components/ui/Button";
import { useSetPasswordContext } from "@/hooks/useSetPassword";
import { Divider } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email");
  const { setValue } = useSetPasswordContext();

  if (!email) {
    return null;
  }

  const handleCodeVerified = (t: string) => {
    setValue({ token: t, email });
    router.replace("/reset-password");
  };

  return (
    <VerificationCode email={email} onCodeChecked={handleCodeVerified}>
      <Divider flexItem className="my-3.5">
        Or
      </Divider>
      <Button variant="outlined" onClick={() => router.replace("/signin")}>
        Continue with password
      </Button>
    </VerificationCode>
  );
}
