import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";

// ─── Couleurs par phase ───────────────────────────────────────────────────────
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

export default function Bible() {
  const [sections,    setSections]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [openPhases,  setOpenPhases]  = useState({});

  // ── Chargement initial + polling (2 min) ──────────────────────────────────
  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/sections");
      if (!res.ok) throw new Error(await res.text());
      const { sections } = await res.json();
      setSections(sections);
      // Ouvrir la première phase par défaut
      setOpenPhases((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const firstPhase = sections[0]?.phase;
        return firstPhase ? { [firstPhase]: true } : {};
      });
    } catch (e) {
      setError("Impossible de charger les données Notion.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
    const interval = setInterval(fetchSections, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSections]);

  // ── Toggle statut ─────────────────────────────────────────────────────────
  const handleToggle = async (section) => {
    const nextStatut = STATUTS[(STATUTS.indexOf(section.statut) + 1) % STATUTS.length];

    // Optimistic update
    setSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, statut: nextStatut } : s))
    );
    setUpdatingIds((prev) => new Set([...prev, section.id]));

    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: section.id, statut: nextStatut }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, statut: section.statut } : s))
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(section.id);
        return next;
      });
    }
  };

  // ── Groupement par phase ──────────────────────────────────────────────────
  const grouped = sections.reduce((acc, s) => {
    if (!acc[s.phase]) acc[s.phase] = [];
    acc[s.phase].push(s);
    return acc;
  }, {});

  const phases = Object.keys(grouped);

  // ── Progression globale ───────────────────────────────────────────────────
  const total    = sections.length;
  const termines = sections.filter((s) => s.statut === "Terminé").length;
  const pct      = total > 0 ? Math.round((termines / total) * 100) : 0;

  return (
    <Layout title="Lecture Bible" showBack>
      <div className="page">
        <div className="container" style={{ paddingTop: 24 }}>

          {/* Progression globale */}
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

          {/* Erreur */}
          {error && (
            <div style={{
              background: "var(--red-soft)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              fontSize: 13,
              color: "var(--red)",
              marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Squelette de chargement */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  height: 56,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: `${i * 150}ms`,
                }} />
              ))}
            </div>
          )}

          {/* Phases */}
          {!loading && phases.map((phase, i) => {
            const { color, soft } = PHASE_COLORS[phase] ?? DEFAULT_COLOR;
            const items   = grouped[phase];
            const done    = items.filter((s) => s.statut === "Terminé").length;
            const isOpen  = !!openPhases[phase];

            return (
              <div
                key={phase}
                className="fade-up"
                style={{ marginBottom: 10, animationDelay: `${i * 60}ms` }}
              >
                {/* En-tête phase (cliquable) */}
                <button
                  onClick={() => setOpenPhases((p) => ({ ...p, [phase]: !isOpen }))}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: isOpen ? soft : "var(--bg-card)",
                    border: "1px solid",
                    borderColor: isOpen ? color : "var(--border)",
                    borderRadius: isOpen ? "var(--radius) var(--radius) 0 0" : "var(--radius)",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{phase}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {done}/{items.length}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>
                      ▾
                    </span>
                  </div>
                </button>

                {/* Sections */}
                {isOpen && (
                  <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderTop: "none",
                    borderRadius: "0 0 var(--radius) var(--radius)",
                    overflow: "hidden",
                  }}>
                    {items.map((section, j) => (
                      <button
                        key={section.id}
                        onClick={() => handleToggle(section)}
                        disabled={updatingIds.has(section.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 16px",
                          textAlign: "left",
                          borderTop: j > 0 ? "1px solid var(--border)" : "none",
                          transition: "background 0.15s",
                          opacity: updatingIds.has(section.id) ? 0.5 : 1,
                          background: "transparent",
                        }}
                      >
                        <span style={{
                          fontSize: 16,
                          color: section.statut === "Terminé" ? color : "var(--text-muted)",
                          flexShrink: 0,
                          transition: "color 0.2s",
                        }}>
                          {STATUT_ICONS[section.statut] ?? "○"}
                        </span>
                        <span style={{
                          fontSize: 14,
                          flex: 1,
                          textDecoration: section.statut === "Terminé" ? "line-through" : "none",
                          color: section.statut === "Terminé" ? "var(--text-muted)" : "var(--text)",
                          transition: "all 0.2s",
                        }}>
                          {section.titre}
                        </span>
                        {section.statut === "En cours" && (
                          <span style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 100,
                            background: "var(--amber-soft)",
                            color: "var(--amber)",
                            fontWeight: 600,
                          }}>
                            En cours
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Note */}
          {!loading && sections.length > 0 && (
            <p style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
              Tap sur une section pour changer son statut.<br />
              Synchronisé avec Notion toutes les 2 minutes.
            </p>
          )}

        </div>
      </div>
    </Layout>
  );
}
