import PlantCard from './PlantCard';

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
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} onMarkWatered={onMarkWatered} />
      ))}
    </div>
  );
}

export default Dashboard;
