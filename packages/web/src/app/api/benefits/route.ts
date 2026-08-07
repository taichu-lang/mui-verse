"server-only";

import { NextResponse } from "next/server";

export async function GET() {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    console.log("server url is required.");
    return NextResponse.error();
  }

  const url = new URL(`${serverUrl}/v1/benefits`);
  const response = await fetch(url, {
    method: "GET",
  });
  if (response.status !== 200) {
    console.log("failed to get benefits, status: ", response.status);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
