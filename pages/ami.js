import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

const PHASE_COLORS = {
  "Phase 1": { color: "#60a5fa", soft: "rgba(96,165,250,0.12)" },
  "Phase 2": { color: "var(--green)", soft: "var(--green-soft)" },
  "Phase 3": { color: "var(--amber)", soft: "var(--amber-soft)" },
  "Phase 4": { color: "#e879f9", soft: "rgba(232,121,249,0.12)" },
  "Phase 5": { color: "var(--red)", soft: "var(--red-soft)" },
};
const DEFAULT_COLOR = { color: "var(--accent)", soft: "var(--accent-soft)" };

const STATUTS = ["À faire", "En cours", "Terminé"];
const STATUT_ICONS = { "À faire": "○", "En cours": "◑", "Terminé": "●" };

// ─── Écran accueil ────────────────────────────────────────────────────────────

function AccueilScreen({ onStart }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const pseudo = input.trim();
    if (!pseudo) return;
    localStorage.setItem("ami_pseudo", pseudo);
    onStart(pseudo);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div className="card fade-up" style={{ width: "100%", maxWidth: 360, padding: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Lecture Bible</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
          Entre ton pseudo pour suivre ta progression.
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ton pseudo"
            autoFocus
            style={{
              padding: "10px 14px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", background: "var(--bg-card)",
              color: "var(--text)", fontSize: 14, outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              padding: "11px 14px", borderRadius: "var(--radius-sm)",
              background: "var(--accent)", color: "#fff", fontWeight: 600,
              fontSize: 14, border: "none",
              cursor: input.trim() ? "pointer" : "not-allowed",
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            Commencer
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Tracker ─────────────────────────────────────────────────────────────────

function Tracker({ pseudo }) {
  const [sections,   setSections]   = useState([]);
  const [progress,   setProgress]   = useState({});
  const [notes,      setNotes]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [openPhases, setOpenPhases] = useState({});
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText,   setNoteText]   = useState("");

  const progressKey = `ami_progression_${pseudo}`;
  const notesKey    = `ami_notes_${pseudo}`;

  useEffect(() => {
    try {
      const savedP = localStorage.getItem(progressKey);
      if (savedP) setProgress(JSON.parse(savedP));
      const savedN = localStorage.getItem(notesKey);
      if (savedN) setNotes(JSON.parse(savedN));
    } catch {}
  }, [progressKey, notesKey]);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/sections");
      if (!res.ok) throw new Error(await res.text());
      const { sections } = await res.json();
      setSections(sections);
      setOpenPhases((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const firstPhase = sections[0]?.phase;
        return firstPhase ? { [firstPhase]: true } : {};
      });
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
    const interval = setInterval(fetchSections, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSections]);

  const handleToggle = (section) => {
    const currentStatut = progress[section.id] ?? "À faire";
    const nextStatut = STATUTS[(STATUTS.indexOf(currentStatut) + 1) % STATUTS.length];
    const next = { ...progress, [section.id]: nextStatut };
    setProgress(next);
    try { localStorage.setItem(progressKey, JSON.stringify(next)); } catch {}
  };

  const openNote = (sectionId) => {
    setNoteText(notes[sectionId] ?? "");
    setOpenNoteId(sectionId);
  };

  const closeNote = () => setOpenNoteId(null);

  const saveNote = (sectionId) => {
    const next = { ...notes, [sectionId]: noteText };
    setNotes(next);
    try { localStorage.setItem(notesKey, JSON.stringify(next)); } catch {}
    setOpenNoteId(null);
  };

  const grouped = sections.reduce((acc, s) => {
    if (!acc[s.phase]) acc[s.phase] = [];
    acc[s.phase].push(s);
    return acc;
  }, {});
  const phases = Object.keys(grouped);

  const total    = sections.length;
  const termines = sections.filter((s) => (progress[s.id] ?? "À faire") === "Terminé").length;
  const pct      = total > 0 ? Math.round((termines / total) * 100) : 0;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 24 }}>

        {!loading && total > 0 && (
          <div className="card fade-up" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Progression globale</span>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {pct}<span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400 }}>%</span>
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
              {termines} / {total} sections terminées
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: "var(--red-soft)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "var(--radius-sm)", padding: "12px 14px",
            fontSize: 13, color: "var(--red)", marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: 56, background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                animation: "pulse 1.4s ease-in-out infinite",
                animationDelay: `${i * 150}ms`,
              }} />
            ))}
          </div>
        )}

        {!loading && phases.map((phase, i) => {
          const { color, soft } = PHASE_COLORS[phase] ?? DEFAULT_COLOR;
          const items  = grouped[phase];
          const done   = items.filter((s) => (progress[s.id] ?? "À faire") === "Terminé").length;
          const isOpen = !!openPhases[phase];

          return (
            <div key={phase} className="fade-up" style={{ marginBottom: 10, animationDelay: `${i * 60}ms` }}>
              <button
                onClick={() => setOpenPhases((p) => ({ ...p, [phase]: !isOpen }))}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", padding: "14px 16px",
                  background: isOpen ? soft : "var(--bg-card)",
                  border: "1px solid", borderColor: isOpen ? color : "var(--border)",
                  borderRadius: isOpen ? "var(--radius) var(--radius) 0 0" : "var(--radius)",
                  transition: "all 0.2s", textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{phase}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{done}/{items.length}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
              </button>

              {isOpen && (
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderTop: "none", borderRadius: "0 0 var(--radius) var(--radius)",
                  overflow: "hidden",
                }}>
                  {items.map((section, j) => {
                    const statut  = progress[section.id] ?? "À faire";
                    const hasNote = !!notes[section.id];

                    return (
                      <div key={section.id} style={{ borderTop: j > 0 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <button
                            onClick={() => handleToggle(section)}
                            style={{
                              flex: 1, display: "flex", alignItems: "center",
                              gap: 12, padding: "12px 16px", textAlign: "left",
                              background: "transparent",
                            }}
                          >
                            <span style={{
                              fontSize: 16, flexShrink: 0, transition: "color 0.2s",
                              color: statut === "Terminé" ? color : "var(--text-muted)",
                            }}>
                              {STATUT_ICONS[statut] ?? "○"}
                            </span>
                            <span style={{
                              fontSize: 14, flex: 1, transition: "all 0.2s",
                              textDecoration: statut === "Terminé" ? "line-through" : "none",
                              color: statut === "Terminé" ? "var(--text-muted)" : "var(--text)",
                            }}>
                              {section.titre}
                            </span>
                            {statut === "En cours" && (
                              <span style={{
                                fontSize: 10, padding: "2px 6px", borderRadius: 100,
                                background: "var(--amber-soft)", color: "var(--amber)", fontWeight: 600,
                              }}>
                                En cours
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => openNoteId === section.id ? closeNote() : openNote(section.id)}
                            title={hasNote ? "Modifier la note" : "Ajouter une note"}
                            style={{
                              fontSize: 13, background: "none", border: "none",
                              cursor: "pointer", padding: "0 12px 0 4px", flexShrink: 0,
                              opacity: hasNote ? 1 : 0.3,
                              color: hasNote ? "var(--accent)" : "var(--text-muted)",
                              transition: "opacity 0.2s",
                            }}
                          >
                            📝
                          </button>
                        </div>

                        {openNoteId === section.id && (
                          <div
                            style={{ padding: "10px 16px 12px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <textarea
                              autoFocus
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              rows={3}
                              placeholder="Ta note..."
                              style={{
                                width: "100%", background: "var(--bg-card)",
                                border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                                color: "var(--text)", fontSize: 13, padding: "8px 10px",
                                resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
                              }}
                            />
                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                              <button
                                onClick={() => saveNote(section.id)}
                                style={{
                                  fontSize: 12, fontWeight: 600, padding: "5px 12px",
                                  borderRadius: "var(--radius-sm)", border: "none",
                                  background: "var(--accent)", color: "#fff", cursor: "pointer",
                                }}
                              >
                                Sauvegarder
                              </button>
                              <button
                                onClick={closeNote}
                                style={{
                                  fontSize: 12, padding: "5px 12px",
                                  borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
                                  background: "none", color: "var(--text-muted)", cursor: "pointer",
                                }}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!loading && sections.length > 0 && (
          <p style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            Tap sur une section pour changer son statut.<br />
            Progression et notes sauvegardées sur cet appareil.
          </p>
        )}

      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function Ami() {
  const [pseudo, setPseudo] = useState(null);
  const [ready,  setReady]  = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ami_pseudo");
    if (saved) setPseudo(saved);
    setReady(true);
  }, []);

  const handleChangePseudo = () => {
    localStorage.removeItem("ami_pseudo");
    setPseudo(null);
  };

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Lecture Bible</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      {pseudo && (
        <header className="topbar">
          <div className="container topbar__inner">
            <span />
            <span className="topbar__title">Lecture Bible</span>
            <button
              onClick={handleChangePseudo}
              style={{
                fontSize: 11, color: "var(--text-dim)", background: "none",
                border: "none", cursor: "pointer", padding: "4px 0",
                width: 60, textAlign: "right",
              }}
            >
              Changer
            </button>
          </div>
        </header>
      )}

      <main>
        {pseudo
          ? <Tracker pseudo={pseudo} />
          : <AccueilScreen onStart={setPseudo} />
        }
      </main>
    </>
  );
}
