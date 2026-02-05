import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null, token: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null, token: null });
  }

  return NextResponse.json({
    user: { id: payload.sub, email: payload.email },
    token,
  });
}
