const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? import.meta.env.VITE_PUSH_PUBLIC_KEY ?? '';

export async function requestNotificationPermission(): Promise<void> {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

export async function subscribePush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    localStorage.setItem('plant-pulse-subscription', JSON.stringify(existing));
    return existing;
  }

  if (!VAPID_PUBLIC_KEY) {
    return null;
  }

  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  });

  localStorage.setItem('plant-pulse-subscription', JSON.stringify(subscription));
  return subscription;
}

export async function saveSubscription(subscription: PushSubscription): Promise<boolean> {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ subscription })
  });

  return response.ok;
}

export async function sendPushMessage(subscription: PushSubscription, payload: { title: string; body: string }): Promise<boolean> {
  const response = await fetch('/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ subscription, title: payload.title, body: payload.body })
  });

  return response.ok;
}

export async function sendLocalNotification(message: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Plant Pulse', {
    body: message,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: 'plant-pulse-test'
  });
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray.buffer;
}
