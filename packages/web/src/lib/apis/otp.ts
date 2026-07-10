import { VerifyOtpResponse } from "@/lib/types/otp";

export async function sendOtpCode(email: string): Promise<boolean> {
  try {
    const client = await fetch("/api/users/otp", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
    const response = await client.json();
    return response.code === 0;
  } catch (err) {
    console.log("failed to send otp code.", err);
    return false;
  }
}

export async function verifyOtpCode(
  email: string,
  code: string,
): Promise<VerifyOtpResponse> {
  const client = await fetch("/api/users/otp/verify", {
    method: "POST",
    body: JSON.stringify({
      email,
      code,
    }),
  });
  const response = (await client.json()) as VerifyOtpResponse;
  return response;
}
