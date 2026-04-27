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
    return existing;
  }

  return null;
}
