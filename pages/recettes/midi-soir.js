import { useState } from "react";
import Layout from "../../components/Layout";
import { recettesMidiSoir } from "../../data/recettes-midi-soir";

const FILTRES = ["Toutes", "Midi", "Soir"];

export default function RecettesMidiSoir() {
  const [selected, setSelected]   = useState(null);
  const [filtre, setFiltre]       = useState("Toutes");

  const recettesFiltrees = recettesMidiSoir.filter((r) => {
    if (filtre === "Toutes") return true;
    return r.categorie === filtre.toLowerCase();
  });

  if (selected !== null) {
    const recette = recettesMidiSoir.find((r) => r.id === selected);
    return (
      <Layout title={recette.titre} showBack>
        <div className="page">
          <div className="container" style={{ paddingTop: 24 }}>
            <button
              onClick={() => setSelected(null)}
              style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Toutes les recettes
            </button>
            <RecetteDetail recette={recette} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Recettes Midi & Soir" showBack>
      <div className="page">
        <div className="container" style={{ paddingTop: 24 }}>

          {/* Filtres */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {FILTRES.map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 100,
                  border: "1px solid",
                  borderColor: filtre === f ? "var(--accent)" : "var(--border)",
                  background: filtre === f ? "var(--accent-soft)" : "transparent",
                  color: filtre === f ? "var(--accent)" : "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recettesFiltrees.map((recette, i) => (
              <button
                key={recette.id}
                className="card fade-up"
                onClick={() => setSelected(recette.id)}
                style={{
                  textAlign: "left",
                  width: "100%",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{
                    fontSize: 26,
                    width: 44,
                    height: 44,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>{recette.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{recette.titre}</span>
                      <span style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: recette.categorie === "midi" ? "var(--amber-soft)" : "var(--accent-soft)",
                        color: recette.categorie === "midi" ? "var(--amber)" : "var(--accent)",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                      }}>
                        {recette.categorie}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {recette.description}
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                      <Stat label="kcal" value={recette.macros.calories} />
                      <Stat label="protéines" value={`${recette.macros.proteines}g`} />
                      <Stat label="temps" value={recette.temps} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value }) {
  return (
    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
      <span style={{ color: "var(--text)", fontWeight: 600 }}>{value}</span> {label}
    </span>
  );
}

function RecetteDetail({ recette }) {
  return (
    <div className="fade-up">
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>{recette.icon}</span>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.2 }}>{recette.titre}</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱ {recette.temps}</span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>{recette.description}</p>
        <div className="macros">
          <MacroItem value={`${recette.macros.calories}`} label="kcal" color="var(--text)" />
          <MacroItem value={`${recette.macros.proteines}g`} label="Protéines" color="#60a5fa" />
          <MacroItem value={`${recette.macros.glucides}g`} label="Glucides" color="var(--amber)" />
          <MacroItem value={`${recette.macros.lipides}g`} label="Lipides" color="var(--green)" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <p className="section-title" style={{ marginTop: 0 }}>Ingrédients</p>
        <div className="ingredients">
          {recette.ingredients.map((ing, i) => (
            <div key={i} className="ingredient">
              <span className="ingredient__qty">{ing.quantite}</span>
              <span className="ingredient__name">{ing.nom}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <p className="section-title" style={{ marginTop: 0 }}>Préparation</p>
        <div className="steps">
          {recette.etapes.map((etape, i) => (
            <div key={i} className="step">
              <span className="step__num">{i + 1}</span>
              <span className="step__text">{etape}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "var(--amber-soft)",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        fontSize: 13,
        color: "var(--amber)",
        lineHeight: 1.5,
      }}>
        💡 {recette.astuce}
      </div>
    </div>
  );
}

function MacroItem({ value, label, color }) {
  return (
    <div className="macros__item">
      <div className="macros__value" style={{ color }}>{value}</div>
      <div className="macros__label">{label}</div>
    </div>
  );
}
