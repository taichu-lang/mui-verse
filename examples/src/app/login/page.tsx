"use client";

import { useAuth, User } from "@/auth/auth";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { setSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async () => {
    const user: User = {
      email: "example@mui-verse.com",
      token: "123",
      expires_at: (Date.now() + 1000 * 60 * 5) / 1000,
    };

    await setSession(user);

    const redirect = searchParams.get("redirect_url") || "/workbench";
    router.replace(redirect);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Button onClick={handleLogin} className="w-3xs">
        Login
      </Button>
    </div>
  );
}
