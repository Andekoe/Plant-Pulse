import webpush from 'web-push';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const publicKey = process.env.PUSH_PUBLIC_KEY || process.env.VITE_PUSH_PUBLIC_KEY;
const privateKey = process.env.PUSH_PRIVATE_KEY;
const subject = process.env.PUSH_SUBJECT || 'mailto:plant-pulse@example.com';

if (!publicKey || !privateKey) {
  console.warn('Push keys are not configured. Set PUSH_PUBLIC_KEY and PUSH_PRIVATE_KEY.');
}

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!publicKey || !privateKey) {
    res.status(500).json({ error: 'Server push keys not configured' });
    return;
  }

  const { subscription, title, body } = req.body || {};
  if (!subscription || !subscription.endpoint || !title || !body) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Push send failed:', error);
    res.status(500).json({ error: 'Failed to send push notification', details: error?.message });
  }
}
