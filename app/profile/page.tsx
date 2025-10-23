import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Event, getEventById, userProfile } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const toEventArray = (ids: string[]): Event[] =>
    ids
      .map((id) => getEventById(id))
      .filter((event): event is Event => Boolean(event));

  const upcomingEvents = toEventArray(userProfile.upcomingEventIds);
  const pastEvents = toEventArray(userProfile.pastEventIds);

  return (
    <>
      <Header
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Expériences", href: "#upcoming", variant: "cta" },
        ]}
      />

      <main className="page-shell profile-main">
        <section className="section white">
          <div id="profile-headline" className="profile-headline">
            <div className="profile-identity">
              <span className="profile-avatar">{userProfile.avatar}</span>
              <div>
                <h1>{userProfile.name}</h1>
                <p>{userProfile.headline}</p>
              </div>
            </div>
            <div className="profile-moodboard">
              {userProfile.moodboard.map((mood) => (
                <span className="badge" key={mood}>
                  {mood}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-connections">
            <h2>Comptes connectés</h2>
            <div className="profile-networks">
              {userProfile.connectedNetworks.map((network) => (
                <span key={network}>{network}</span>
              ))}
            </div>
          </div>

          <div className="profile-highlights">
            <h2>Insights personnalisation</h2>
            <div className="highlight-grid">
              {userProfile.highlights.map((highlight) => (
                <article className="highlight-card" key={highlight.title}>
                  <span>{highlight.title}</span>
                  <strong>{highlight.value}</strong>
                  <p>{highlight.context}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section soft" id="upcoming">
          <div className="section-header">
            <div>
              <h2>Expériences à venir</h2>
              <p className="section-subtitle">
                RadaR ajuste les créneaux pour matcher avec vos disponibilités et
                votre moodboard.
              </p>
            </div>
            <Link className="view-all" href="/discover">
              Voir d&apos;autres suggestions →
            </Link>
          </div>
          <div className="experience-grid">
            {upcomingEvents.length === 0 ? (
              <p className="section-subtitle">
                Aucun événement planifié. Ajoutez des collectifs !
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <article className="experience-card" key={event.id}>
                  <div>
                    <span className="discover-date">
                      {formatDate(event.date)} · {event.time}
                    </span>
                    <h3>{event.title}</h3>
                    <p>
                      {event.location} • {event.district}e
                    </p>
                  </div>
                  <Link href={`/event/${event.id}`}>Afficher →</Link>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h2>Expériences passées</h2>
              <p className="section-subtitle">
                Vos explorations précédentes nourrissent les nouvelles
                recommandations.
              </p>
            </div>
          </div>
          <div className="experience-grid">
            {pastEvents.length === 0 ? (
              <p className="section-subtitle">
                Pas encore d&apos;expériences passées. À vos découvertes !
              </p>
            ) : (
              pastEvents.map((event) => (
                <article className="experience-card" key={event.id}>
                  <div>
                    <span className="discover-date">
                      {formatDate(event.date)} · {event.time}
                    </span>
                    <h3>{event.title}</h3>
                    <p>
                      {event.location} • {event.district}e
                    </p>
                  </div>
                  <Link href={`/event/${event.id}`}>Afficher →</Link>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer
        tagline="Personnalisation alimentée par vos vibes."
        links={[
          { label: "Accueil", href: "/" },
          { label: "Découvrir", href: "/discover" },
          { label: "Expériences", href: "/profile#upcoming" },
        ]}
      />
    </>
  );
}
