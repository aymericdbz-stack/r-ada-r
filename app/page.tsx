'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { categories, curators, events } from "@/lib/data";
import { formatDate, formatTimelineDate } from "@/lib/format";

const HERO_TAGS = ["Tech", "Street Art", "Food", "Clubbing", "Jazz"];

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchContext, setSearchContext] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [vibeFilter, setVibeFilter] = useState<"all" | "avant-garde" | "underground" | "premium">("all");
  const [mapLabel, setMapLabel] = useState("Actualiser");
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  const timelineEvents = useMemo(() => {
    const now = new Date();
    const horizon = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    return events.filter((event) => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      return eventDate >= now && eventDate <= horizon;
    });
  }, []);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (category) => vibeFilter === "all" || category.vibe === vibeFilter
      ),
    [vibeFilter]
  );

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setFilteredEvents(events);
      setSearchContext(null);
      setSearchValue("");
      return;
    }

    const lowered = trimmed.toLowerCase();
    const matches = events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowered) ||
        event.category.toLowerCase().includes(lowered) ||
        event.tags.some((tag) => tag.toLowerCase().includes(lowered))
    );

    setFilteredEvents(matches);
    setSearchContext(trimmed);
  };

  const handleMapRefresh = () => {
    setMapLabel("Profil mis à jour ✓");
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }
    refreshTimeout.current = setTimeout(() => setMapLabel("Actualiser"), 2200);
  };

  return (
    <>
      <Header
        links={[
          { label: "Découvrir", href: "/#discover" },
          { label: "Catégories", href: "/#categories" },
          { label: "Mon profil", href: "/profile" },
          { label: "Explorer tout", href: "/discover", variant: "cta" },
        ]}
      />

      <main className="page-shell">
        <section className="hero">
          <div className="hero-content">
            <p className="hero-pill">Paris &nbsp;•&nbsp; Culture sur-mesure</p>
            <h1>
              Les événements qui vous ressemblent,{" "}
              <span>sélectionnés par RadaR</span>
            </h1>
            <p className="hero-subtitle">
              Connectez vos playlists, artistes préférés et inspirations pour
              recevoir une programmation parisienne qui colle à votre énergie.
            </p>
            <form
              className="hero-search"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch(searchValue);
              }}
            >
              <input
                type="text"
                placeholder="Rechercher un événement, une galerie, un club..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button type="submit">Trouver mon ambiance</button>
            </form>
            <div className="hero-tags">
              {HERO_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchValue(tag);
                    handleSearch(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <aside className="hero-card">
            <h3>Playlist connectée</h3>
            <p>
              Synchronisez Spotify pour générer un moodboard vivant et recevoir
              des invitations privées.
            </p>
            <Link className="card-link" href="/profile">
              Activer mon profil →
            </Link>
            <div className="hero-stack">
              <div className="stack-card">
                <span className="stack-label">Ce soir</span>
                <h4>Late Night Atelier</h4>
                <p>Atelier d&apos;arts digitaux chez Gaîté Lyrique</p>
              </div>
              <div className="stack-card focus">
                <span className="stack-label">Recommandé</span>
                <h4>Le Bal • Expo immersive</h4>
                <p>curation AI x photographie • 19h30</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="section" id="discover">
          <div className="section-header">
            <div>
              <h2>Découvrir des événements</h2>
              <p className="section-subtitle">
                Explorez les temps forts du moment, sélectionnés pour les profils
                proches du vôtre.
              </p>
            </div>
            <Link className="view-all" href="/discover">
              Tout voir →
            </Link>
          </div>

          {searchContext && filteredEvents.length === 0 ? (
            <p className="section-subtitle">
              Pas de match parfait sur « {searchContext} ». Ajustez vos mots-clés
              ou explorez les catégories.
            </p>
          ) : (
            <div className="event-carousel">
              {filteredEvents.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="event-cover">
                    <span>{event.coverTag}</span>
                    <h3>{event.title}</h3>
                    <p>{event.blurb}</p>
                  </div>
                  <div className="event-info">
                    <div className="event-meta">
                      <span>📍 {event.location}, {event.district}</span>
                      <span>🕒 {formatDate(event.date)} · {event.time}</span>
                    </div>
                    <div className="event-meta">
                      <span>✨ {event.availability}</span>
                      <span>🎧 {event.curator}</span>
                    </div>
                    <div className="event-meta">
                      {event.tags.map((tag) => `#${tag}`).join(" ")}
                    </div>
                    <Link className="view-all" href={`/event/${event.id}`}>
                      En savoir plus →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section soft" id="categories">
          <div className="section-header">
            <div>
              <h2>Parcourir par univers</h2>
              <p className="section-subtitle">
                Ajustez la grille pour ne voir que ce qui correspond à votre mood
                actuel.
              </p>
            </div>
            <div className="filter-toggle">
              <label htmlFor="vibe-filter">Vibe</label>
              <select
                id="vibe-filter"
                value={vibeFilter}
                onChange={(event) =>
                  setVibeFilter(event.target.value as typeof vibeFilter)
                }
              >
                <option value="all">Tout</option>
                <option value="avant-garde">Avant-garde</option>
                <option value="underground">Underground</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          <div className="category-grid">
            {filteredCategories.map((category) => {
              const count = events.filter(
                (event) => event.category === category.id
              ).length;
              return (
                <article className="category-card" key={category.id}>
                  <span className="badge">{category.vibe}</span>
                  <h3>{category.id}</h3>
                  <p>{category.description}</p>
                  <span className="event-meta">
                    {count} événement(s) curated
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section timeline">
          <div className="section-header">
            <div>
              <h2>À proximité dans les 72 prochaines heures</h2>
              <p className="section-subtitle">
                RadaR repère les expériences qui matchent avec votre agenda et vos
                goûts.
              </p>
            </div>
            <div className="timeline-legend">
              <span>
                <span className="dot live" />
                En direct
              </span>
              <span>
                <span className="dot hot" />
                Quasi complet
              </span>
            </div>
          </div>
          <div className="timeline-wrapper">
            {timelineEvents.map((event) => (
              <article className="timeline-card" key={event.id}>
                <div className="time">
                  {event.time}
                  <span>{formatTimelineDate(event.date)}</span>
                </div>
                <div className="details">
                  <h3>{event.title}</h3>
                  <p>
                    {event.location} • {event.district} arrondissement
                  </p>
                  <div className="avatars">
                    <span className="avatar">{event.category[0]}</span>
                    <span className="avatar">✨</span>
                    <span className="event-meta">{event.availability}</span>
                  </div>
                </div>
                <div className="cta">
                  <button type="button">Réserver</button>
                  <Link href={`/event/${event.id}`}>Détails & maps →</Link>
                </div>
              </article>
            ))}
            {timelineEvents.length === 0 && (
              <p className="section-subtitle">
                Aucun événement imminent. Revenez un peu plus tard !
              </p>
            )}
          </div>
        </section>

        <section className="section white">
          <div className="split-panel">
            <div>
              <p className="hero-pill">Réseaux de créateurs</p>
              <h2>Des curateurs parisiens alimentent RadaR</h2>
              <p className="section-subtitle">
                DJs, galeristes, collectifs underground et chefs invitent leurs
                communautés. Accédez à leurs calendriers en un clic.
              </p>
              <ul className="curator-list">
                <li>
                  <span className="badge">Collectif</span>
                  <span>Club Matin • afters minimal &amp; house</span>
                </li>
                <li>
                  <span className="badge alt">Galerie</span>
                  <span>Atelier des Lumières • expériences immersives</span>
                </li>
                <li>
                  <span className="badge">Scène</span>
                  <span>Philharmonie de Paris &amp; projets hybrides</span>
                </li>
              </ul>
              <Link className="view-all" href="/discover#curators">
                Découvrir les curateurs →
              </Link>
            </div>
            <div className="map-card">
              <div className="map-header">
                <span>Heatmap Paris</span>
                <button type="button" onClick={handleMapRefresh}>
                  {mapLabel}
                </button>
              </div>
              <div className="map-body">
                <img
                  src="/paris-map.svg"
                  alt="Carte stylisée de Paris"
                  loading="lazy"
                />
              </div>
              <div className="map-footer">
                <span className="dot hot" />
                <span>Concentration d&apos;événements pour votre profil</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        tagline="Créé pour les explorateurs culturels parisiens."
        links={[
          { label: "Profil", href: "/profile" },
          { label: "Découverte", href: "/discover" },
          { label: "Événements", href: "/event/ledger-op3n" },
        ]}
      />
    </>
  );
}
