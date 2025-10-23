import Link from "next/link";

type NavLink = {
  label: string;
  href: string;
  variant?: "cta";
};

interface HeaderProps {
  links: NavLink[];
}

export function Header({ links }: HeaderProps) {
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
      </nav>
    </header>
  );
}
