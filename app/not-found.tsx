import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell not-found">
      <h1>Page introuvable</h1>
      <p>
        On dirait que cette expérience s&apos;est déjà envolée. Revenez vers la
        découverte ou votre profil pour poursuivre l&apos;exploration.
      </p>
      <div className="not-found-actions">
        <Link href="/">Retour à l&apos;accueil</Link>
        <Link href="/discover">Parcourir les événements</Link>
      </div>
    </main>
  );
}
