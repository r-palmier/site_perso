// pages/api/update.js
// POST /api/update — met à jour le statut d'une section dans Notion

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const STATUTS_VALIDES = ["À faire", "En cours", "Terminé"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageId, statut } = req.body;

  if (!pageId || !statut) {
    return res.status(400).json({ error: "pageId et statut sont requis." });
  }

  if (!STATUTS_VALIDES.includes(statut)) {
    return res.status(400).json({
      error: `Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(", ")}`,
    });
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Statut: { select: { name: statut } },
      },
    });

    return res.status(200).json({ success: true, pageId, statut });
  } catch (error) {
    console.error("[Notion] update.js error:", error.message);
    return res.status(500).json({ error: "Impossible de mettre à jour la section." });
  }
}
