import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

// ─── Configuration de la navigation ──────────────────────────────────────────
// Pour ajouter une page dans la nav : ajouter une entrée ici.
const NAV_ITEMS = [
  { href: "/",                  icon: "⌂",  label: "Home"   },
  { href: "/bible",             icon: "📖", label: "Bible"  },
  { href: "/recettes/matin",    icon: "🌅", label: "Matin"  },
  { href: "/recettes/midi-soir",icon: "🍽️", label: "Repas"  },
];

export default function Layout({ children, title = "Robin App", showBack = false }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Topbar */}
      <header className="topbar">
        <div className="container topbar__inner">
          {showBack ? (
            <button className="topbar__back" onClick={() => router.back()}>
              ← Retour
            </button>
          ) : (
            <span />
          )}
          <span className="topbar__title">{title}</span>
          <span style={{ width: 60 }} /> {/* spacer pour centrer le titre */}
        </div>
      </header>

      {/* Contenu de la page */}
      <main>{children}</main>

      {/* Navigation bottom (mobile uniquement, cachée sur desktop via CSS) */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive =
            href === "/"
              ? router.pathname === "/"
              : router.pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`bottom-nav__item ${isActive ? "active" : ""}`}
            >
              <span className="icon">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
