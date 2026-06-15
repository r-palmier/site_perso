import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, note } = req.body;
  if (!id) return res.status(400).json({ error: "id requis" });

  try {
    await notion.pages.update({
      page_id: id,
      properties: {
        "Note du lecteur": {
          rich_text: note ? [{ type: "text", text: { content: note } }] : [],
        },
      },
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[Notion] note.js error:", error.message);
    return res.status(500).json({ error: "Impossible de sauvegarder la note." });
  }
}
