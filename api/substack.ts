import type { VercelRequest, VercelResponse } from '@vercel/node';

const FEED_URL = 'https://engineeringtaste.substack.com/feed';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const upstream = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'engineeringtaste.com feed proxy' },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'upstream feed unavailable' });
    }

    const xml = await upstream.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch {
    return res.status(500).json({ error: 'feed fetch failed' });
  }
}
