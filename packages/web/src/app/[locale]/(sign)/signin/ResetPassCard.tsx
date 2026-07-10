"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function ResetPassCard({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const router = useRouter();

  const redirect = () => {
    router.push(`/forgot-password?email=${email}`);
  };

  return (
    <SignCard>
      <Title>Reset Password</Title>
      <span className="mt-9 text-center text-sm">{`Click “Continue” to reset your password for ${email}`}</span>
      <Button className="mt-7.5" onClick={redirect}>
        Continue
      </Button>
      <div
        className="mt-7.5 cursor-pointer text-center text-sm underline"
        onClick={onBack}
      >
        Back to sign in
      </div>
    </SignCard>
  );
}
