import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Configuration Supabase incomplète côté serveur." },
      { status: 500 }
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = payload?.email?.trim().toLowerCase();
  const password = payload?.password ?? "";

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email ou mot de passe invalide." },
      { status: 400 }
    );
  }

  const adminClient = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !userData?.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Impossible de créer l'utilisateur." },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
    error: signInError,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !session) {
    return NextResponse.json(
      { error: signInError?.message ?? "Erreur lors de la connexion." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}
