import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { extname } from "path";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { PROJECT_STORAGE_BUCKET } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const file = formData.get("file");

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Le titre est obligatoire." },
      { status: 400 }
    );
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Merci de joindre un fichier valide." },
      { status: 400 }
    );
  }

  const fileExtension = extname(file.name) || ".png";
  const storagePath = `${session.user.id}/${randomUUID()}${fileExtension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: storageError } = await supabase.storage
    .from(PROJECT_STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (storageError) {
    return NextResponse.json(
      { error: storageError.message },
      { status: 500 }
    );
  }

  const { data: insertData, error: insertError } = await (supabase
    .from("projects") as any)
    .insert({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : null,
      image_path: storagePath,
      user_id: session.user.id,
    })
    .select()
    .single();

  if (insertError || !insertData) {
    return NextResponse.json(
      { error: insertError?.message ?? "Impossible d'enregistrer le projet." },
      { status: 500 }
    );
  }

  const { data: publicData } = supabase.storage
    .from(PROJECT_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return NextResponse.json({
    project: {
      ...insertData,
      public_url: publicData?.publicUrl ?? null,
    },
  });
}
