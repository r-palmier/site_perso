import { useState } from "react";
import Layout from "../../components/Layout";
import { recettesMatin } from "../../data/recettes-matin";

export default function RecettesMatin() {
  const [selected, setSelected] = useState(0);
  const recette = recettesMatin[selected];

  return (
    <Layout title="Recettes Matin" showBack>
      <div className="page">
        <div className="container" style={{ paddingTop: 24 }}>

          {/* Onglets */}
          <div style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 4,
          }}>
            {recettesMatin.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 100,
                  border: "1px solid",
                  borderColor: selected === i ? "var(--accent)" : "var(--border)",
                  background: selected === i ? "var(--accent-soft)" : "transparent",
                  color: selected === i ? "var(--accent)" : "var(--text-muted)",
                  fontWeight: 500,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                <span>{r.icon}</span>
                <span>{r.titre}</span>
              </button>
            ))}
          </div>

          {/* Recette */}
          <RecetteDetail key={recette.id} recette={recette} />

        </div>
      </div>
    </Layout>
  );
}

function RecetteDetail({ recette }) {
  return (
    <div className="fade-up">

      {/* Header recette */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>{recette.icon}</span>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.2 }}>
              {recette.titre}
            </h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱ {recette.temps}</span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
          {recette.description}
        </p>

        {/* Macros */}
        <div className="macros">
          <MacroItem value={`${recette.macros.calories}`} label="kcal" color="var(--text)" />
          <MacroItem value={`${recette.macros.proteines}g`} label="Protéines" color="#60a5fa" />
          <MacroItem value={`${recette.macros.glucides}g`} label="Glucides" color="var(--amber)" />
          <MacroItem value={`${recette.macros.lipides}g`} label="Lipides" color="var(--green)" />
        </div>
      </div>

      {/* Ingrédients */}
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

      {/* Étapes */}
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

      {/* Astuce */}
      <div className="tip" style={{
        background: "var(--amber-soft)",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        fontSize: 13,
        color: "var(--amber)",
        lineHeight: 1.5,
      }}>
        {recette.astuce}
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
