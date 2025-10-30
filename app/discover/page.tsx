'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { categories, curators, events, getEventById } from "@/lib/data";
import { formatDate } from "@/lib/format";

type VibeFilter = "all" | "avant-garde" | "underground" | "premium";
type TimeframeFilter = "all" | "dans-48h" | "weekend" | "soir" | "matin";

const TIMEFRAME_OPTIONS: Array<{ label: string; value: TimeframeFilter }> = [
  { label: "Toute la semaine", value: "all" },
  { label: "Dans les 48h", value: "dans-48h" },
  { label: "Weekend", value: "weekend" },
  { label: "Nocturne", value: "soir" },
  { label: "Matinale", value: "matin" },
];

const VIBE_OPTIONS: Array<{ label: string; value: VibeFilter }> = [
  { label: "Tout", value: "all" },
  { label: "Avant-garde", value: "avant-garde" },
  { label: "Underground", value: "underground" },
  { label: "Premium", value: "premium" },
];

export default function DiscoverPage() {
  const [vibeFilter, setVibeFilter] = useState<VibeFilter>("all");
  const [timeframeFilter, setTimeframeFilter] = useState<TimeframeFilter>("all");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const lowered = searchValue.trim().toLowerCase();
      const matchesSearch =
        !lowered ||
        event.title.toLowerCase().includes(lowered) ||
        event.tags.some((tag) => tag.toLowerCase().includes(lowered)) ||
        event.category.toLowerCase().includes(lowered);

      const matchesVibe = vibeFilter === "all" || event.vibe === vibeFilter;

      const matchesCategories =
        activeCategories.length === 0 ||
        activeCategories.includes(event.category.toLowerCase());

      let matchesTimeframe = true;
      if (timeframeFilter === "dans-48h") {
        matchesTimeframe =
          eventDate <= new Date(now.getTime() + 48 * 60 * 60 * 1000);
      } else if (timeframeFilter === "weekend") {
        const day = eventDate.getDay();
        matchesTimeframe = day === 6 || day === 0;
      } else if (timeframeFilter === "soir") {
        matchesTimeframe = eventDate.getHours() >= 18;
      } else if (timeframeFilter === "matin") {
        matchesTimeframe = eventDate.getHours() < 12;
      }

      return matchesSearch && matchesVibe && matchesCategories && matchesTimeframe;
    });
  }, [activeCategories, searchValue, timeframeFilter, vibeFilter]);

  const toggleCategory = (categoryId: string) => {
    setActiveCategories((current) => {
      const normalized = categoryId.toLowerCase();
      if (current.includes(normalized)) {
        return current.filter((item) => item !== normalized);
      }
      return [...current, normalized];
    });
  };

  return (
    <>
      <Header
        links={[
          { label: "Accueil", href: "/" },
          { label: "Mon profil", href: "/profile" },
          { label: "Collectifs", href: "#curators", variant: "cta" },
        ]}
      />

      <main className="page-shell discover-main">
        <section className="section white">
          <div className="section-header">
            <div>
              <h1>Explorer les expériences autour de vous</h1>
              <p className="section-subtitle">
                Ajustez les filtres pour faire ressortir l&apos;agenda qui
                correspond à vos préférences et à votre énergie du moment.
              </p>
            </div>
            <div className="discover-search">
              <input
                type="search"
                placeholder="Chercher un collectif, un spot ou une vibe…"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>
          </div>

          <div className="discover-layout">
            <aside className="discover-filters">
              <div className="filter-group">
                <h3>Ambiance</h3>
                {VIBE_OPTIONS.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="filter-vibe"
                      value={option.value}
                      checked={vibeFilter === option.value}
                      onChange={() => setVibeFilter(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h3>Moments</h3>
                {TIMEFRAME_OPTIONS.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="filter-timeframe"
                      value={option.value}
                      checked={timeframeFilter === option.value}
                      onChange={() => setTimeframeFilter(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h3>Catégories</h3>
                <div className="chip-set">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`chip-filter${
                        activeCategories.includes(category.id.toLowerCase())
                          ? " active"
                          : ""
                      }`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.actionLabel ?? category.id}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="discover-results">
              {filteredEvents.length === 0 ? (
                <div className="empty-state">
                  <h3>On n&apos;a rien trouvé…</h3>
                  <p>
                    Modifiez les filtres ou connectez un nouveau collectif pour
                    élargir vos suggestions.
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <article className="discover-card" key={event.id}>
                    <div className="discover-meta">
                      <span className="badge">{event.vibe}</span>
                      <span className="discover-date">
                        {formatDate(event.date)} · {event.time}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p className="discover-location">
                      {event.location} • {event.district}e
                    </p>
                    <p className="discover-tags">
                      {event.tags.map((tag) => `#${tag}`).join(" ")}
                    </p>
                    <div className="discover-footer">
                      <span>{event.availability}</span>
                      <div className="discover-actions">
                        <Link href={`/event/${event.id}`}>Détails</Link>
                        <button type="button">
                          Réserver cet événement culturel
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section soft" id="curators">
          <div className="section-header">
            <div>
              <h2>Collectifs qui nourrissent RadaR</h2>
              <p className="section-subtitle">
                Ajoutez des curateurs pour affiner encore vos recommandations.
              </p>
            </div>
          </div>
          <div className="curator-grid">
            {curators.map((curator) => {
              const nextEvent = getEventById(curator.nextEventId);
              return (
                <article className="curator-card" key={curator.id}>
                  <div className="curator-avatar">
                    {curator.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="curator-content">
                    <div className="curator-header">
                      <h3>{curator.name}</h3>
                      <span>{curator.followers} abonnés</span>
                    </div>
                    <p>{curator.bio}</p>
                    <div className="curator-footer">
                      <span className="badge">{curator.vibe}</span>
                      {nextEvent ? (
                        <Link href={`/event/${nextEvent.id}`}>
                          Prochain: {nextEvent.title} →
                        </Link>
                      ) : (
                        <span>Programmation en cours</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer
        tagline="Découverte live de la scène parisienne."
        links={[
          { label: "Accueil", href: "/" },
          { label: "Profil", href: "/profile" },
          { label: "Collectifs", href: "/discover#curators" },
        ]}
      />
    </>
  );
}
