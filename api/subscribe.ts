import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const subscription = req.body?.subscription;
  if (!subscription || !subscription.endpoint) {
    res.status(400).json({ error: 'Invalid subscription body' });
    return;
  }

  // In a real production flow, store the subscription in a database.
  // This endpoint only confirms the backend received it.
  res.status(200).json({ success: true });
}
