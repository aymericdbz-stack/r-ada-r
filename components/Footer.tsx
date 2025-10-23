import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

interface FooterProps {
  links: FooterLink[];
  tagline?: string;
}

export function Footer({ links, tagline }: FooterProps) {
  return (
    <footer className="footer">
      <div>
        <span className="brand">RadaR</span>
        <p>{tagline ?? "Explorations culturelles parisiens sur mesure."}</p>
      </div>
      <div className="footer-links">
        {links.map(({ label, href }) => (
          <Link key={`${label}-${href}`} href={href}>
            {label}
          </Link>
        ))}
      </div>
      <div className="footer-meta">© 2025 RadaR Collective</div>
    </footer>
  );
}
