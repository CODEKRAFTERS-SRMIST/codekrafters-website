import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: users, error: uErr } = await supabase.from('users').select('*');
    const { data: admins, error: aErr } = await supabase.from('admins').select('*');

    if (uErr || aErr) throw new Error("Database error");

    const all = [
      ...(users || []),
      ...(admins || [])
    ];
    
    return NextResponse.json({ users: all });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, role, admin_level } = body;

    // Fetch the user to see where they currently are
    let isCurrentlyAdmin = false;
    let currentUser = null;

    let { data: u } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    if (u) {
      currentUser = u;
    } else {
      let { data: a } = await supabase.from('admins').select('*').eq('id', id).maybeSingle();
      if (a) {
        currentUser = a;
        isCurrentlyAdmin = true;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (role === "ADMIN") {
      // Promoting to Admin
      if (!isCurrentlyAdmin) {
        // Move from users to admins
        await supabase.from('users').delete().eq('id', id);
        await supabase.from('admins').insert([{ 
          email: currentUser.email, 
          password: currentUser.password, 
          fullName: currentUser.fullName, 
          admin_level: admin_level || 'LEAD' 
        }]);
      } else {
        // Just update admin_level
        await supabase.from('admins').update({ admin_level }).eq('id', id);
      }
    } else {
      // Demoting to APPLICANT
      if (isCurrentlyAdmin) {
        // Move from admins to users
        await supabase.from('admins').delete().eq('id', id);
        await supabase.from('users').insert([{ 
          email: currentUser.email, 
          password: currentUser.password, 
          fullName: currentUser.fullName, 
          role: "APPLICANT" 
        }]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Promote Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
