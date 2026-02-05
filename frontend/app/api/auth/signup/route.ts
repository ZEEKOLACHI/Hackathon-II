import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { user, token } = await signUp(email, password, name);

    const response = NextResponse.json({ user, token });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
