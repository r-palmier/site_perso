import Link from "next/link";
import Layout from "../components/Layout";

// ─── Cards de navigation ──────────────────────────────────────────────────────
// Pour ajouter une section : ajouter une entrée ici.
const SECTIONS = [
  {
    href:        "/bible",
    icon:        "📖",
    titre:       "Suivi Lecture Bible",
    description: "Plan d'étude NBS — phases, sections et progression synchronisés avec Notion.",
    badge:       "Notion sync",
    color:       "var(--accent)",
    colorSoft:   "var(--accent-soft)",
  },
  {
    href:        "/recettes/matin",
    icon:        "🌅",
    titre:       "Recettes Matin",
    description: "3 recettes protéinées pour bien démarrer — rapides et adaptées à la recompo.",
    badge:       "3 recettes",
    color:       "var(--amber)",
    colorSoft:   "var(--amber-soft)",
  },
  {
    href:        "/recettes/midi-soir",
    icon:        "🍽️",
    titre:       "Recettes Midi & Soir",
    description: "Repas complets pour la journée et le soir — prise de muscle, perte de gras.",
    badge:       "3 recettes",
    color:       "var(--green)",
    colorSoft:   "var(--green-soft)",
  },
];

export default function Home() {
  return (
    <Layout title="Robin App">
      <div className="page">
        <div className="container">

          {/* Header */}
          <div style={{ padding: "40px 0 32px" }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Tableau de bord
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 7vw, 40px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Bienvenue,<br />Robin.
            </h1>
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SECTIONS.map(({ href, icon, titre, description, badge, color, colorSoft }, i) => (
              <Link
                key={href}
                href={href}
                className="card fade-up"
                style={{
                  display: "block",
                  animationDelay: `${i * 80}ms`,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>

                  {/* Icône */}
                  <div style={{
                    width: 48,
                    height: 48,
                    background: colorSoft,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}>
                    {icon}
                  </div>

                  {/* Texte */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{titre}</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: colorSoft,
                        color,
                        flexShrink: 0,
                        letterSpacing: "0.03em",
                      }}>
                        {badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {description}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
