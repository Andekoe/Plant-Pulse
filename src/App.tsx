import { useEffect, useMemo, useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import { plantProfiles, PlantProfile } from './plants/plantDatabase';
import { getNextWateringDate, shouldWaterToday } from './plants/wateringScheduler';
import { fetchRainLast24h } from './weather/weatherService';
import { loadPlantRecords, savePlantRecords, PlantRecord } from './store/plantStore';
import {
  requestNotificationPermission,
  subscribePush,
  saveSubscription,
  sendPushMessage,
  sendLocalNotification
} from './notifications/pushService';

const DEV_MODE = typeof window !== 'undefined' && localStorage.getItem('dev-mode') === 'true';

interface PlantStatus {
  id: string;
  name: string;
  description: string;
  size: PlantProfile['size'];
  needsWater: boolean;
  nextWatering: Date;
  lastWatered?: string;
  rainSummary: string;
}

function App() {
  const [records, setRecords] = useState<PlantRecord[]>([]);
  const [rainMm, setRainMm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const savedRecords = loadPlantRecords();
    const initialRecords = plantProfiles.map((plant) => {
      return savedRecords.find((record) => record.id === plant.id) ?? { id: plant.id };
    });
    setRecords(initialRecords);

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    requestNotificationPermission()
      .then(() => {
        if ('Notification' in window) {
          setNotificationPermission(Notification.permission);
        }
      })
      .catch(() => {
        // Notification permission is optional in this version.
      });

    fetchRainLast24h()
      .then(setRainMm)
      .catch(() => setError('Unable to load weather data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleEnableNotifications = async () => {
    try {
      await requestNotificationPermission();
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }

      if (Notification.permission === 'granted') {
        const subscription = await subscribePush();
        if (!subscription) {
          setError('Push subscription unavailable. Check the browser or VAPID key configuration.');
          setPushEnabled(false);
          return;
        }

        const saved = await saveSubscription(subscription);
        if (!saved) {
          setError('Push subscription saved locally, but backend save failed. Reminders may not be incomplete.');
        }

        setPushEnabled(saved);
      }
    } catch {
      setError('Unable to enable notifications.');
    }
  };

  const handleTestNotification = async () => {
    if (!pushEnabled) {
      try {
        await sendLocalNotification('This is a Plant Pulse reminder test.');
      } catch {
        setError('Unable to show a local test notification.');
      }
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        throw new Error('Missing push subscription');
      }

      const success = await sendPushMessage(subscription, {
        title: 'Plant Pulse',
        body: 'This is a Plant Pulse reminder test.'
      });

      if (!success) {
        throw new Error('Push send failed');
      }
    } catch {
      setError('Unable to send a push test notification. Falling back to local notification.');
      try {
        await sendLocalNotification('This is a Plant Pulse reminder test.');
      } catch {
        setError('Unable to show a fallback local test notification.');
      }
    }
  };

  const plantStatus = useMemo(
    () =>
      plantProfiles.map((profile) => {
        const record = records.find((item) => item.id === profile.id) ?? { id: profile.id };
        const nextWatering = getNextWateringDate(record, profile, rainMm);
        const needsWater = shouldWaterToday(record, profile, rainMm);
        const rainSummary = rainMm === null ? 'Weather not loaded' : `${rainMm.toFixed(1)} mm rain in last 24h`;

        return {
          id: profile.id,
          name: profile.name,
          description: profile.description,
          size: profile.size,
          needsWater,
          nextWatering,
          lastWatered: record.lastWatered,
          rainSummary
        };
      }),
    [records, rainMm]
  );

  const handleMarkWatered = (plantId: string) => {
    const now = new Date().toISOString();
    const existingRecord = records.find((record) => record.id === plantId);
    const updated = existingRecord
      ? records.map((record) =>
          record.id === plantId ? { ...record, lastWatered: now } : record
        )
      : [...records, { id: plantId, lastWatered: now }];

    savePlantRecords(updated);
    setRecords(updated);
  };

  // Periodic check for plants needing water and send local notifications
  useEffect(() => {
    if (notificationPermission !== 'granted' || loading) return;

    const checkAndNotify = () => {
      const now = new Date();
      const today = now.toDateString();
      const lastNotified = localStorage.getItem('last-plant-notification');
      
      if (lastNotified === today) return; // Already notified today

      const needsWaterCount = plantStatus.filter(plant => plant.needsWater).length;
      if (needsWaterCount > 0) {
        const plantNames = plantStatus.filter(plant => plant.needsWater).map(plant => plant.name).join(', ');
        sendLocalNotification(`${needsWaterCount} plant${needsWaterCount > 1 ? 's' : ''} need${needsWaterCount > 1 ? '' : 's'} water today: ${plantNames}`);
        localStorage.setItem('last-plant-notification', today);
      }
    };

    // Check immediately
    checkAndNotify();

    // Check every 30 minutes
    const interval = setInterval(checkAndNotify, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [notificationPermission, loading, plantStatus]);

  const needsWaterCount = plantStatus.filter((plant) => plant.needsWater).length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>
          <span className="header-icon">🌿</span>
          Plant Pulse
        </h1>
        <p className="subtitle">Keep your balcony plants thriving</p>
        {DEV_MODE && (
          <button
            className="dev-reset-btn"
            type="button"
            onClick={() => {
              savePlantRecords([]);
              setRecords([]);
              alert('Watering records reset!');
            }}
            title="Dev: Reset all watering records"
          >
            ⟲ Reset
          </button>
        )}
      </header>

      <section className="summary-panel">
        <div>
          <strong>{needsWaterCount}</strong> plant{needsWaterCount === 1 ? '' : 's'} need{needsWaterCount === 1 ? 's' : ''} water today 🌱
        </div>
        <div className="summary-panel__rain">☔ {rainMm === null ? 'Loading...' : `${rainMm.toFixed(1)} mm rain (24h)`}</div>
        <button
          className="refresh-weather-btn"
          type="button"
          onClick={() => {
            setRainMm(null);
            fetchRainLast24h()
              .then(setRainMm)
              .catch(() => setError('Unable to load weather data.'));
          }}
          title="Refresh weather data"
        >
          ↻
        </button>
      </section>

      <section className="notification-panel">
        {notificationPermission !== 'granted' ? (
          <button className="notification-action-btn" type="button" onClick={handleEnableNotifications}>
            Enable notifications
          </button>
        ) : (
          <div className="notification-status">Notifications enabled ✅</div>
        )}
        {notificationPermission === 'granted' && (
          <button className="notification-action-btn" type="button" onClick={handleTestNotification}>
            Test notification
          </button>
        )}
      </section>

      {error ? <div className="error-banner">{error}</div> : null}
      {loading ? <div className="loading-banner">Loading plant data…</div> : null}

      <Dashboard plants={plantStatus} onMarkWatered={handleMarkWatered} />

      <footer className="footer-note">
        Tap a plant card to mark it as watered. Your plants will thank you! 💚
      </footer>
    </div>
  );
}

export default App;
