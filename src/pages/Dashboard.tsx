import { useParams, Link } from 'react-router-dom';
import { useTeams, useMatches } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import PointsTable from '@/components/PointsTable';
import StatsCharts from '@/components/StatsCharts';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const { teams } = useTeams(id);
  const { matches } = useMatches(id);

  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Link to={`/tournament/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Tournament
      </Link>
      <h1 className="font-display text-xl font-bold">Dashboard & Stats</h1>
      <PointsTable teams={teams} />
      <StatsCharts teams={teams} matches={matches} />
    </div>
  );
}
