import { useEffect, useMemo, useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import { plantProfiles, PlantProfile } from './plants/plantDatabase';
import { getNextWateringDate, getPlantStatus, shouldWaterToday } from './plants/wateringScheduler';
import { fetchRainLast24h } from './weather/weatherService';
import { loadPlantRecords, savePlantRecords, PlantRecord } from './store/plantStore';
import { requestNotificationPermission } from './notifications/pushService';

const DEV_MODE = localStorage.getItem('dev-mode') === 'true';

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

  useEffect(() => {
    const savedRecords = loadPlantRecords();
    const initialRecords = plantProfiles.map((plant) => {
      return savedRecords.find((record) => record.id === plant.id) ?? { id: plant.id };
    });
    setRecords(initialRecords);

    requestNotificationPermission().catch(() => {
      // Notification permission is optional in this version.
    });

    fetchRainLast24h()
      .then(setRainMm)
      .catch(() => setError('Unable to load weather data.'))
      .finally(() => setLoading(false));
  }, []);

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
    const updated = records.map((record) =>
      record.id === plantId ? { ...record, lastWatered: new Date().toISOString() } : record
    );
    savePlantRecords(updated);
    setRecords(updated);
  };

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
