import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const normalized = email.trim().toLowerCase();
  const { data: existing, error: readError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  if (readError) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const { error } = existing
    ? await supabase
        .from("customers")
        .update({ accepts_marketing: true })
        .eq("id", existing.id)
    : await supabase
        .from("customers")
        .insert({ email: normalized, accepts_marketing: true, tags: ["newsletter"] });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
