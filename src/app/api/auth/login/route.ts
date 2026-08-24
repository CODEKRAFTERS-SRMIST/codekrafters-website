import { NextResponse } from "next/server";
import { UserRole } from "@/types/join";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body as {
      email: string;
      password?: string;
      role: UserRole;
    };

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (role === "ADMIN") {
      // Validate Admin against Supabase
      const { data: admin, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !admin) {
        return NextResponse.json(
          { error: "Invalid admin email or password." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          role: "ADMIN",
          fullName: "CodeKrafters Admin",
        },
      });
    }

    // Applicant Login / General User
    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Buffer.from(email.toLowerCase()).toString("base64").substring(0, 10)}`,
        email: email.toLowerCase(),
        role: "APPLICANT",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
