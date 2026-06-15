import { useState, useEffect } from "react";
import Head from "next/head";

// ─── Données du plan (identiques à la page principale) ────────────────────────
const PHASES = [
  {
    id: "phase1",
    label: "Phase 1",
    title: "Fondations narratives",
    subtitle: "Le grand récit — par où tout commence",
    color: "#8B6914",
    accent: "#D4A843",
    sections: [
      { id: "marc_1_4", livre: "Évangile de Marc", label: "Marc 1–4" },
      { id: "marc_5_8", livre: "Évangile de Marc", label: "Marc 5–8" },
      { id: "marc_9_12", livre: "Évangile de Marc", label: "Marc 9–12" },
      { id: "marc_13_16", livre: "Évangile de Marc", label: "Marc 13–16" },
      { id: "gen_1_4", livre: "Genèse 1–11", label: "Genèse 1–4" },
      { id: "gen_5_8", livre: "Genèse 1–11", label: "Genèse 5–8" },
      { id: "gen_9_11", livre: "Genèse 1–11", label: "Genèse 9–11" },
      { id: "gen_12_20", livre: "Genèse 12–50", label: "Genèse 12–20" },
      { id: "gen_21_30", livre: "Genèse 12–50", label: "Genèse 21–30" },
      { id: "gen_31_40", livre: "Genèse 12–50", label: "Genèse 31–40" },
      { id: "gen_41_50", livre: "Genèse 12–50", label: "Genèse 41–50" },
      { id: "ex_1_7", livre: "Exode 1–20", label: "Exode 1–7" },
      { id: "ex_8_14", livre: "Exode 1–20", label: "Exode 8–14" },
      { id: "ex_15_20", livre: "Exode 1–20", label: "Exode 15–20" },
      { id: "jos_1_8", livre: "Josué", label: "Josué 1–8" },
      { id: "jos_9_16", livre: "Josué", label: "Josué 9–16" },
      { id: "jos_17_24", livre: "Josué", label: "Josué 17–24" },
      { id: "sam1_1_10", livre: "1 Samuel", label: "1 Samuel 1–10" },
      { id: "sam1_11_20", livre: "1 Samuel", label: "1 Samuel 11–20" },
      { id: "sam1_21_31", livre: "1 Samuel", label: "1 Samuel 21–31" },
      { id: "sam2_1_8", livre: "2 Samuel", label: "2 Samuel 1–8" },
      { id: "sam2_9_16", livre: "2 Samuel", label: "2 Samuel 9–16" },
      { id: "sam2_17_24", livre: "2 Samuel", label: "2 Samuel 17–24" },
      { id: "luc_1_6", livre: "Évangile de Luc", label: "Luc 1–6" },
      { id: "luc_7_12", livre: "Évangile de Luc", label: "Luc 7–12" },
      { id: "luc_13_18", livre: "Évangile de Luc", label: "Luc 13–18" },
      { id: "luc_19_24", livre: "Évangile de Luc", label: "Luc 19–24" },
      { id: "act_1_7", livre: "Actes des Apôtres", label: "Actes 1–7" },
      { id: "act_8_14", livre: "Actes des Apôtres", label: "Actes 8–14" },
      { id: "act_15_21", livre: "Actes des Apôtres", label: "Actes 15–21" },
      { id: "act_22_28", livre: "Actes des Apôtres", label: "Actes 22–28" },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2",
    title: "Poésie & Sagesse",
    subtitle: "La dimension émotionnelle et contemplative",
    color: "#2D5A8E",
    accent: "#5B9BD5",
    sections: [
      { id: "ps_1_30", livre: "Psaumes", label: "Psaumes 1–30" },
      { id: "ps_31_60", livre: "Psaumes", label: "Psaumes 31–60" },
      { id: "ps_61_90", livre: "Psaumes", label: "Psaumes 61–90" },
      { id: "ps_91_120", livre: "Psaumes", label: "Psaumes 91–120" },
      { id: "ps_121_150", livre: "Psaumes", label: "Psaumes 121–150" },
      { id: "prov_1_10", livre: "Proverbes", label: "Proverbes 1–10" },
      { id: "prov_11_20", livre: "Proverbes", label: "Proverbes 11–20" },
      { id: "prov_21_31", livre: "Proverbes", label: "Proverbes 21–31" },
      { id: "job_1_14", livre: "Job", label: "Job 1–14" },
      { id: "job_15_28", livre: "Job", label: "Job 15–28" },
      { id: "job_29_42", livre: "Job", label: "Job 29–42" },
      { id: "eccl_1_6", livre: "Ecclésiaste", label: "Ecclésiaste 1–6" },
      { id: "eccl_7_12", livre: "Ecclésiaste", label: "Ecclésiaste 7–12" },
    ],
  },
  {
    id: "phase3",
    label: "Phase 3",
    title: "Prophètes",
    subtitle: "La voix de Dieu dans l'histoire d'Israël",
    color: "#6B3A8E",
    accent: "#A855F7",
    sections: [
      { id: "amos_1_5", livre: "Amos", label: "Amos 1–5" },
      { id: "amos_6_9", livre: "Amos", label: "Amos 6–9" },
      { id: "osee_1_7", livre: "Osée", label: "Osée 1–7" },
      { id: "osee_8_14", livre: "Osée", label: "Osée 8–14" },
      { id: "es_1_13", livre: "Ésaïe 1–39", label: "Ésaïe 1–13" },
      { id: "es_14_26", livre: "Ésaïe 1–39", label: "Ésaïe 14–26" },
      { id: "es_27_39", livre: "Ésaïe 1–39", label: "Ésaïe 27–39" },
      { id: "es_40_50", livre: "Ésaïe 40–66", label: "Ésaïe 40–50" },
      { id: "es_51_60", livre: "Ésaïe 40–66", label: "Ésaïe 51–60" },
      { id: "es_61_66", livre: "Ésaïe 40–66", label: "Ésaïe 61–66" },
      { id: "jer_1_13", livre: "Jérémie", label: "Jérémie 1–13" },
      { id: "jer_14_26", livre: "Jérémie", label: "Jérémie 14–26" },
      { id: "jer_27_39", livre: "Jérémie", label: "Jérémie 27–39" },
      { id: "jer_40_52", livre: "Jérémie", label: "Jérémie 40–52" },
    ],
  },
  {
    id: "phase4",
    label: "Phase 4",
    title: "Épîtres de Paul",
    subtitle: "La théologie chrétienne fondamentale",
    color: "#1A6B4A",
    accent: "#34D399",
    sections: [
      { id: "gal_1_3", livre: "Galates", label: "Galates 1–3" },
      { id: "gal_4_6", livre: "Galates", label: "Galates 4–6" },
      { id: "phil_1_2", livre: "Philippiens", label: "Philippiens 1–2" },
      { id: "phil_3_4", livre: "Philippiens", label: "Philippiens 3–4" },
      { id: "eph_1_3", livre: "Éphésiens", label: "Éphésiens 1–3" },
      { id: "eph_4_6", livre: "Éphésiens", label: "Éphésiens 4–6" },
      { id: "col_1_2", livre: "Colossiens", label: "Colossiens 1–2" },
      { id: "col_3_4", livre: "Colossiens", label: "Colossiens 3–4" },
      { id: "rom_1_4", livre: "Romains", label: "Romains 1–4" },
      { id: "rom_5_8", livre: "Romains", label: "Romains 5–8" },
      { id: "rom_9_11", livre: "Romains", label: "Romains 9–11" },
      { id: "rom_12_16", livre: "Romains", label: "Romains 12–16" },
      { id: "1cor_1_6", livre: "1 Corinthiens", label: "1 Corinthiens 1–6" },
      { id: "1cor_7_11", livre: "1 Corinthiens", label: "1 Corinthiens 7–11" },
      { id: "1cor_12_16", livre: "1 Corinthiens", label: "1 Corinthiens 12–16" },
      { id: "2cor_1_6", livre: "2 Corinthiens", label: "2 Corinthiens 1–6" },
      { id: "2cor_7_13", livre: "2 Corinthiens", label: "2 Corinthiens 7–13" },
    ],
  },
  {
    id: "phase5",
    label: "Phase 5",
    title: "AT complet",
    subtitle: "Combler les lacunes — loi, rois, exil",
    color: "#7A3B1E",
    accent: "#F97316",
    sections: [
      { id: "lev_1_9", livre: "Lévitique", label: "Lévitique 1–9" },
      { id: "lev_10_18", livre: "Lévitique", label: "Lévitique 10–18" },
      { id: "lev_19_27", livre: "Lévitique", label: "Lévitique 19–27" },
      { id: "nb_1_12", livre: "Nombres", label: "Nombres 1–12" },
      { id: "nb_13_24", livre: "Nombres", label: "Nombres 13–24" },
      { id: "nb_25_36", livre: "Nombres", label: "Nombres 25–36" },
      { id: "deut_1_11", livre: "Deutéronome", label: "Deutéronome 1–11" },
      { id: "deut_12_22", livre: "Deutéronome", label: "Deutéronome 12–22" },
      { id: "deut_23_34", livre: "Deutéronome", label: "Deutéronome 23–34" },
      { id: "jug_1_10", livre: "Juges", label: "Juges 1–10" },
      { id: "jug_11_21", livre: "Juges", label: "Juges 11–21" },
      { id: "ruth_1_4", livre: "Ruth", label: "Ruth 1–4" },
      { id: "1r_1_11", livre: "1 Rois", label: "1 Rois 1–11" },
      { id: "1r_12_22", livre: "1 Rois", label: "1 Rois 12–22" },
      { id: "2r_1_12", livre: "2 Rois", label: "2 Rois 1–12" },
      { id: "2r_13_25", livre: "2 Rois", label: "2 Rois 13–25" },
      { id: "esth_1_5", livre: "Esther", label: "Esther 1–5" },
      { id: "esth_6_10", livre: "Esther", label: "Esther 6–10" },
      { id: "ezr_1_6", livre: "Esdras + Néhémie", label: "Esdras 1–6" },
      { id: "ezr_7_10", livre: "Esdras + Néhémie", label: "Esdras 7–10" },
      { id: "neh_1_7", livre: "Esdras + Néhémie", label: "Néhémie 1–7" },
      { id: "neh_8_13", livre: "Esdras + Néhémie", label: "Néhémie 8–13" },
    ],
  },
  {
    id: "phase6",
    label: "Phase 6",
    title: "NT complet & Apocalyptique",
    subtitle: "Clore le canon — les écrits avancés",
    color: "#1A3A6B",
    accent: "#60A5FA",
    sections: [
      { id: "mat_1_7", livre: "Évangile de Matthieu", label: "Matthieu 1–7" },
      { id: "mat_8_14", livre: "Évangile de Matthieu", label: "Matthieu 8–14" },
      { id: "mat_15_21", livre: "Évangile de Matthieu", label: "Matthieu 15–21" },
      { id: "mat_22_28", livre: "Évangile de Matthieu", label: "Matthieu 22–28" },
      { id: "jn_1_7", livre: "Évangile de Jean", label: "Jean 1–7" },
      { id: "jn_8_14", livre: "Évangile de Jean", label: "Jean 8–14" },
      { id: "jn_15_21", livre: "Évangile de Jean", label: "Jean 15–21" },
      { id: "heb_1_6", livre: "Hébreux", label: "Hébreux 1–6" },
      { id: "heb_7_13", livre: "Hébreux", label: "Hébreux 7–13" },
      { id: "jac_1_5", livre: "Jacques", label: "Jacques 1–5" },
      { id: "1p_1_5", livre: "1 & 2 Pierre", label: "1 Pierre 1–5" },
      { id: "2p_1_3", livre: "1 & 2 Pierre", label: "2 Pierre 1–3" },
      { id: "1jn_1_5", livre: "1, 2 & 3 Jean + Jude", label: "1 Jean 1–5" },
      { id: "2jn_jude", livre: "1, 2 & 3 Jean + Jude", label: "2 Jean, 3 Jean, Jude" },
      { id: "dan_1_6", livre: "Daniel", label: "Daniel 1–6" },
      { id: "dan_7_12", livre: "Daniel", label: "Daniel 7–12" },
      { id: "apoc_1_5", livre: "Apocalypse", label: "Apocalypse 1–5" },
      { id: "apoc_6_11", livre: "Apocalypse", label: "Apocalypse 6–11" },
      { id: "apoc_12_17", livre: "Apocalypse", label: "Apocalypse 12–17" },
      { id: "apoc_18_22", livre: "Apocalypse", label: "Apocalypse 18–22" },
    ],
  },
];

const STORAGE_KEY = "bible_ami_tracker_v1";
const ALL_IDS = PHASES.flatMap((p) => p.sections.map((s) => s.id));
const TOTAL = ALL_IDS.length;

// ─── Composants ───────────────────────────────────────────────────────────────

function ProgressBar({ value, accent }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${Math.min(value, 100)}%`,
          background: accent,
          borderRadius: 99,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

function PhaseCard({ phase, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const done = phase.sections.filter((s) => checked[s.id]).length;
  const total = phase.sections.length;
  const pct = Math.round((done / total) * 100);
  const complete = done === total;

  // Grouper par livre
  const livres = {};
  for (const s of phase.sections) {
    if (!livres[s.livre]) livres[s.livre] = [];
    livres[s.livre].push(s);
  }

  return (
    <div
      style={{
        background: `${phase.color}18`,
        border: `1px solid ${phase.accent}30`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      {/* Header de phase */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: complete ? phase.accent : `${phase.accent}20`,
            border: `2px solid ${phase.accent}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {complete ? (
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M1 6L5.5 10.5L15 1" stroke="#0f1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: phase.accent, fontFamily: "monospace" }}>
              {phase.label.split(" ")[1]}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "Georgia, serif" }}>
            {phase.title}
          </div>
          <div style={{ marginTop: 5 }}>
            <ProgressBar value={pct} accent={phase.accent} />
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: phase.accent, fontFamily: "monospace" }}>
            {pct}%
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{open ? "▲" : "▼"}</div>
        </div>
      </button>

      {/* Sections dépliées */}
      {open && (
        <div style={{ padding: "0 12px 12px" }}>
          {Object.entries(livres).map(([livre, secs]) => (
            <div key={livre} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: phase.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "6px 4px 4px",
                  fontFamily: "monospace",
                }}
              >
                {livre}
              </div>
              {secs.map((s) => {
                const done = !!checked[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => onToggle(s.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: done ? "rgba(255,255,255,0.07)" : "transparent",
                      border: "1px solid",
                      borderColor: done ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      marginBottom: 5,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                      minHeight: 44, // touch target confortable
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        border: "2px solid",
                        borderColor: done ? "#34D399" : "rgba(255,255,255,0.3)",
                        background: done ? "#34D399" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)",
                        textDecoration: done ? "line-through" : "none",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Ami() {
  const [checked, setChecked] = useState({});
  const [ready, setReady] = useState(false);

  // Chargement depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const done = ALL_IDS.filter((id) => checked[id]).length;
  const pct = Math.round((done / TOTAL) * 100);

  return (
    <>
      <Head>
        <title>Plan d&apos;étude biblique — NBS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0f1117" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#0f1117", paddingBottom: 60 }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(180deg, #1a1220 0%, #0f1117 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "28px 16px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", marginBottom: 6 }}>
            NBS · Canon Protestant
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              margin: "0 0 4px",
              background: "linear-gradient(135deg, #D4A843, #F7D580)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Plan d&apos;étude biblique
          </h1>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
            6 phases · de débutant à expert
          </div>

          {/* Progression globale */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Ma progression
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#D4A843", fontFamily: "monospace" }}>
                {ready ? `${pct}%` : "—"}
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: ready ? `${pct}%` : "0%",
                  background: "linear-gradient(90deg, #D4A843, #F7D580)",
                  borderRadius: 99,
                  transition: "width 0.4s ease",
                  boxShadow: "0 0 8px #D4A84355",
                }}
              />
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
              {ready ? `${done} / ${TOTAL} sections lues` : "Chargement..."}
            </div>
          </div>
        </div>

        {/* Phases */}
        <div style={{ padding: "16px 12px" }}>
          {ready && PHASES.map((phase, i) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              checked={checked}
              onToggle={toggle}
            />
          ))}

          {ready && (
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                textAlign: "center",
                padding: "8px 0",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              Ta progression est sauvegardée sur cet appareil.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
