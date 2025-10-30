import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { DashboardClient } from "@/components/DashboardClient";
import type { Database } from "@/lib/database.types";
import { PROJECT_STORAGE_BUCKET } from "@/lib/constants";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Tableau de bord • RadaR",
};

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  const typedProjects =
    (projects as Database["public"]["Tables"]["projects"]["Row"][] | null) ?? [];

  const enriched = typedProjects.map((project) => {
    let publicUrl: string | null = null;
    if (project.image_path) {
      const { data } = supabase.storage
        .from(PROJECT_STORAGE_BUCKET)
        .getPublicUrl(project.image_path);
      publicUrl = data?.publicUrl ?? null;
    }

    return {
      ...project,
      public_url: publicUrl,
    };
  });

  return (
    <>
      <Header
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Dashboard", href: "/dashboard", variant: "cta" },
        ]}
      />
      <main className="page-shell">
        <DashboardClient projects={enriched} />
      </main>
    </>
  );
}
