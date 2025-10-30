'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type NavLink = {
  label: string;
  href: string;
  variant?: "cta";
};

interface HeaderProps {
  links: NavLink[];
}

export function Header({ links }: HeaderProps) {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSignOut = async () => {
    setSubmitting(true);
    try {
      await signOut();
      router.replace("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-pill">β</span>
        <span>RadaR</span>
      </div>
      <nav className="nav-links">
        {links.map(({ label, href, variant }) => (
          <Link
            key={`${label}-${href}`}
            href={href}
            className={variant === "cta" ? "nav-cta" : undefined}
          >
            {label}
          </Link>
        ))}
        {loading ? null : user ? (
          <div className="nav-authenticated">
            <span className="nav-identity">{user.email}</span>
            <button
              type="button"
              className="nav-logout"
              onClick={handleSignOut}
              disabled={submitting}
            >
              {submitting ? "..." : "Déconnexion"}
            </button>
          </div>
        ) : (
          <Link href="/login" className="nav-cta">
            Se connecter
          </Link>
        )}
      </nav>
    </header>
  );
}
