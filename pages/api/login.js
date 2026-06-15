export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { password } = req.body;

  if (!password || password !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  res.setHeader(
    'Set-Cookie',
    `auth=${process.env.SITE_PASSWORD}; Path=/; HttpOnly; SameSite=Strict`
  );
  return res.status(200).json({ ok: true });
}
