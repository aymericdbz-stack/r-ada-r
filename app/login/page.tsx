import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import type { Database } from "@/lib/database.types";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Connexion • RadaR",
};

export default async function LoginPage() {
  let session = null;
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
      data: { session: serverSession },
    } = await supabase.auth.getSession();
    session = serverSession;
  } catch (error) {
    console.error("Unable to retrieve session", error);
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Header
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Inscription", href: "/signup", variant: "cta" },
        ]}
      />
      <main className="page-shell auth-page">
        <AuthForm initialMode="login" />
      </main>
    </>
  );
}
