'use client';

import Link from "next/link";
import { useMemo } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  categories,
  events,
  featuredCalendars,
} from "@/lib/data";

const PRIMARY_NAV = [
  { label: "Événements", href: "/discover" },
  { label: "Calendriers", href: "/discover#curators" },
  { label: "Découvrir", href: "/#popular" },
];

export default function HomePage() {
  const popularEvents = useMemo(() => events.slice(0, 6), []);
  const highlightedCategories = useMemo(() => categories.slice(0, 9), []);
  const spotlightCalendars = useMemo(() => featuredCalendars.slice(0, 6), []);

  return (
    <>
      <Header
        links={[
          { label: "Événements", href: "/#popular" },
          { label: "Catégories", href: "/#categories" },
          { label: "Calendriers", href: "/#calendars" },
          { label: "Inscription", href: "/signup", variant: "cta" },
        ]}
      />

      <main className="page-shell landing">
        <section className="hero hero-compact">
          <nav className="hero-nav">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hero-intro">
            <h1>Découvrir des événements</h1>
            <div className="hero-actions">
              <Link href="/signup" className="hero-cta">
                Créer mon compte
              </Link>
            </div>
          </div>
        </section>

        <section className="section event-feed-section" id="popular">
          <div className="section-header align-baseline">
            <div>
              <h2>Événements populaires</h2>
            </div>
          </div>
          <div className="event-feed">
            {popularEvents.map((event) => (
              <article className="event-feed-card" key={event.id}>
                <div className="event-feed-media">
                  <span>{event.coverTag}</span>
                </div>
                <div className="event-feed-content">
                  <h3>{event.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section soft" id="categories">
          <h2>Parcourir par catégorie</h2>
          <div className="category-list">
            {highlightedCategories.map((category) => (
              <article className="category-tile" key={category.id}>
                <div className="category-icon">{category.icon}</div>
                <div className="category-copy">
                  <h3>{category.id}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="calendars">
          <h2>Calendriers en vedette</h2>
          <div className="calendar-grid">
            {spotlightCalendars.map((calendar) => (
              <article className="calendar-card" key={calendar.id}>
                <div className="calendar-header">
                  <div className="calendar-icon">{calendar.icon}</div>
                </div>
                <h3>{calendar.name}</h3>
              </article>
            ))}
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
