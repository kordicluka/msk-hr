import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      status: 401,
      error: "Unauthorized",
      user: null,
      authenticated: false,
    });
  }

  return NextResponse.json({
    status: 200,
    authenticated: true,
    user: session.user,
  });
}
