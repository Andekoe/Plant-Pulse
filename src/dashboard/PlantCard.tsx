import { useState } from 'react';
import { PlantProfile } from '../plants/plantDatabase';

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    description: string;
    size: 'small' | 'medium';
    needsWater: boolean;
    nextWatering: Date;
    lastWatered?: string;
    rainSummary: string;
  };
  onMarkWatered: (plantId: string) => void;
  profile?: PlantProfile;
}

const plantIcons: Record<string, string> = {
  palm: '🌴',
  lavender: '💜',
  'olive-tree': '🫒',
  oregano: '🌿',
  rosemary: '🌲'
};

const plantTips: Record<string, string[]> = {
  palm: [
    'Water when top 2cm of soil is dry',
    'Avoid waterlogging at all costs',
    'Prefers indirect, bright light',
    'Keep humidity moderate'
  ],
  lavender: [
    'Water deeply but infrequently',
    'Allow soil to dry between waterings',
    'Thrives in full sun',
    'Avoid wet foliage to prevent fungal issues'
  ],
  'olive-tree': [
    'Deep watering is better than frequent shallow watering',
    'Tolerates drought well once established',
    'Needs 6+ hours of sunlight daily',
    'Prune after flowering season'
  ],
  oregano: [
    'Let soil dry between waterings',
    'Water at the base, not on leaves',
    'Loves sunlight and well-draining soil',
    'Harvest leaves regularly for bushier growth'
  ],
  rosemary: [
    'Water very sparingly; prefers dry conditions',
    'Almost never overwater',
    'Requires excellent drainage',
    'Place in the sunniest spot available'
  ]
};

function PlantCard({ plant, onMarkWatered, profile }: PlantCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const icon = plantIcons[plant.id] || '🌱';
  
  // Check if watered today
  const today = new Date().toDateString();
  const lastWateredToday = plant.lastWatered ? new Date(plant.lastWatered).toDateString() === today : false;
  
  // Calculate days until next watering
  const today_date = new Date();
  const daysUntilNext = Math.ceil((plant.nextWatering.getTime() - today_date.getTime()) / (1000 * 60 * 60 * 24));
  
  const nextWateringLabel = plant.nextWatering
    ? plant.nextWatering.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : 'Not scheduled';


  return (
    <>
      <article className={`plant-card ${plant.needsWater ? 'plant-card--alert' : ''} ${lastWateredToday ? 'plant-card--watered' : ''}`}>
        <div className="plant-card__header">
          <div>
            <div className="plant-card__icon">{icon}</div>
            <h2>{plant.name}</h2>
            <p className="plant-card__subtitle">{plant.description}</p>
          </div>
          <div className="plant-card__top-right">
            <span className="plant-card__badge">{plant.size}</span>
            <button
              className="plant-card__info-btn"
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              title="Plant details and care tips"
              aria-label={`Show details for ${plant.name}`}
            >
              ℹ️
            </button>
          </div>
        </div>

        <div className="plant-card__status">
          <div>
            <strong>Water today</strong>
            <p>{nextWateringLabel}</p>
            {lastWateredToday && <span className="watered-badge">✓ Watered today</span>}
          </div>
          <div>
            <strong>Last watered</strong>
            <p>{plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>

        <div className="plant-card__next-watering">
          <strong>Next watering:</strong> {' '}
          <span className={daysUntilNext <= 0 ? 'urgent' : daysUntilNext === 1 ? 'soon' : ''}>
            {daysUntilNext <= 0 ? 'Today!' : daysUntilNext === 1 ? 'Tomorrow' : `in ${daysUntilNext} days`}
          </span>
        </div>

        <p className="plant-card__rain">{plant.rainSummary}</p>

        <button className="mark-watered-button" type="button" onClick={() => onMarkWatered(plant.id)}>
          Mark as watered
        </button>
      </article>

      {showDetails && (
        <div className="plant-details-modal">
          <div className="plant-details-modal__content">
            <div className="plant-details-modal__header">
              <h3>{plant.name} Care Guide</h3>
              <button
                className="plant-details-modal__close"
                type="button"
                onClick={() => setShowDetails(false)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {profile && (
              <>
                <div className="plant-details-section">
                  <strong>Water Frequency (Summer):</strong>
                  <p>Every {profile.waterFrequencyDays} days</p>
                </div>
                <div className="plant-details-section">
                  <strong>Drought Tolerance:</strong>
                  <p className="tolerance-badge">{profile.droughtTolerance}</p>
                </div>
              </>
            )}

            <div className="plant-details-section">
              <strong>Care Tips:</strong>
              <ul className="plant-tips-list">
                {(plantTips[plant.id] || []).map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="plant-details-section">
              <strong>Current Info:</strong>
              <p>💧 {plant.rainSummary}</p>
              <p>📅 Last watered: {plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</p>
              <p>📆 Next watering: {nextWateringLabel}</p>
            </div>
          </div>
          <div className="plant-details-modal__backdrop" onClick={() => setShowDetails(false)} />
        </div>
      )}
    </>
  );
}

export default PlantCard;
