import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { PROJECT_STORAGE_BUCKET } from "@/lib/constants";

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const projectId = params.id;

  const { data: project, error: fetchError } = await (supabase
    .from("projects") as any)
    .select("id, user_id, image_path")
    .eq("id", projectId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const typedProject = project as Database["public"]["Tables"]["projects"]["Row"] | null;

  if (!typedProject || typedProject.user_id !== session.user.id) {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }

  if (typedProject.image_path) {
    const { error: storageError } = await supabase.storage
      .from(PROJECT_STORAGE_BUCKET)
      .remove([typedProject.image_path]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }
  }

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", typedProject.id)
    .eq("user_id", session.user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
