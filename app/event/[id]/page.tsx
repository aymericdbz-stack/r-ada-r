import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getEventById } from "@/lib/data";
import { formatDate } from "@/lib/format";

interface EventPageProps {
  params: { id: string };
}

export default function EventPage({ params }: EventPageProps) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Profil", href: "/profile" },
        ]}
      />
      <main className="page-shell event-main">
        <div className="event-detail" id="event-detail">
          <header className="event-hero">
            <div>
              <span className="badge">{event.vibe}</span>
              <h1>{event.title}</h1>
              <p>{event.blurb}</p>
              <div className="event-hero-meta">
                <span>
                  📍 {event.location}, {event.district} arrondissement
                </span>
                <span>
                  🗓 {formatDate(event.date)} · {event.time}
                </span>
              </div>
            </div>
            <aside>
              <div className="event-ticket">
                <h3>Réservation RadaR</h3>
                <p>{event.availability}</p>
                <button type="button">
                  Confirmer ma place pour cette expérience culturelle
                </button>
              </div>
              <div className="event-curator">
                <span className="badge">Curator</span>
                <p>{event.curator}</p>
              </div>
            </aside>
          </header>
          <section className="event-body">
            <article>
              <h2>À propos</h2>
              <p>
                {event.title} rassemble la scène parisienne autour de{" "}
                {event.tags[0]}. Profitez d&apos;une programmation
                multi-sensorielle avec un accompagnement personnalisé par RadaR.
                Notre algorithme a matché cet événement avec vos goûts :{" "}
                {event.tags.join(", ")}.
              </p>
              <h3>Planning</h3>
              <ul>
                <li>19h00 — Accueil et onboarding RadaR.</li>
                <li>19h30 — Expérience principale.</li>
                <li>21h00 — After intimiste réservé aux membres.</li>
              </ul>
            </article>
            <aside>
              <div className="event-box">
                <h3>Accès</h3>
                <p>Metro: République (3, 5, 8, 9, 11)</p>
                <p>
                  Adresse: {event.location}, Paris {event.district}e
                </p>
              </div>
              <div className="event-box">
                <h3>Dress code</h3>
                <p>Creative casual · laissez parler votre style.</p>
              </div>
              <div className="event-box">
                <h3>Partager</h3>
                <p>
                  Diffusez l&apos;événement aux amis et collectifs depuis votre
                  dashboard.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer
        tagline="Accès privilégiés aux événements parisiens."
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Profil", href: "/profile" },
        ]}
      />
    </>
  );
}
