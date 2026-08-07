"server-only";

import { getAuthSession } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const params = request.nextUrl.searchParams;
  const url = new URL(`${serverUrl}/v1/payments/orders`);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: "GET",
    headers: await getAuthSession(),
  });
  if (response.status !== 200) {
    console.log("failed to get orders, status: ", response.status);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
