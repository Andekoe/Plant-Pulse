import PlantCard from './PlantCard';
import { plantProfiles } from '../plants/plantDatabase';

interface DashboardProps {
  plants: Array<{
    id: string;
    name: string;
    description: string;
    size: 'small' | 'medium';
    needsWater: boolean;
    nextWatering: Date;
    lastWatered?: string;
    rainSummary: string;
  }>;
  onMarkWatered: (plantId: string) => void;
}

function Dashboard({ plants, onMarkWatered }: DashboardProps) {
  return (
    <div className="dashboard-grid">
      {plants.map((plant) => {
        const profile = plantProfiles.find((p) => p.id === plant.id);
        return (
          <PlantCard
            key={plant.id}
            plant={plant}
            onMarkWatered={onMarkWatered}
            profile={profile}
          />
        );
      })}
    </div>
  );
}

export default Dashboard;
