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
}

function PlantCard({ plant, onMarkWatered }: PlantCardProps) {
  const nextWateringLabel = plant.nextWatering
    ? plant.nextWatering.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : 'Not scheduled';

  return (
    <article className={`plant-card ${plant.needsWater ? 'plant-card--alert' : ''}`}>
      <div className="plant-card__header">
        <div>
          <h2>{plant.name}</h2>
          <p className="plant-card__subtitle">{plant.description}</p>
        </div>
        <span className="plant-card__badge">{plant.size}</span>
      </div>

      <div className="plant-card__status">
        <div>
          <strong>{plant.needsWater ? 'Water today' : 'Next water'}</strong>
          <p>{nextWateringLabel}</p>
        </div>
        <div>
          <strong>Last watered</strong>
          <p>{plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</p>
        </div>
      </div>

      <p className="plant-card__rain">{plant.rainSummary}</p>

      <button className="mark-watered-button" type="button" onClick={() => onMarkWatered(plant.id)}>
        Mark as watered
      </button>
    </article>
  );
}

export default PlantCard;
