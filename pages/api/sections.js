// pages/api/sections.js
// GET /api/sections — charge les sections depuis la database Notion

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

console.log("Token:", process.env.NOTION_TOKEN ? "✓ présent" : "✗ manquant");
console.log("Database ID:", DATABASE_ID);
console.log("notion.databases:", typeof notion.databases);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "Ordre", direction: "ascending" }],
    });

    const sections = response.results.map((page) => ({
      id:     page.id,
      titre:  page.properties["Nom"]?.title?.[0]?.plain_text ?? "Sans titre",
      phase:  page.properties["Phase"]?.select?.name ?? "Autre",
      statut: page.properties["Statut"]?.select?.name ?? "À faire",
    }));

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
    return res.status(200).json({ sections });
  } catch (error) {
    console.error("[Notion] sections.js error:", error.message);
    return res.status(500).json({ error: "Impossible de charger les sections." });
  }
}
