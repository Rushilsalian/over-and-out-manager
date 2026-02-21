import { useParams, Link } from 'react-router-dom';
import { useTournaments, useTeams, useMatches } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Swords, BarChart3, ArrowLeft } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import PointsTable from '@/components/PointsTable';
import StatsCharts from '@/components/StatsCharts';

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const { tournaments } = useTournaments();
  const { teams } = useTeams(id);
  const { matches } = useMatches(id);

  const tournament = tournaments.find(t => t.id === id);
  if (!tournament) return <div className="container py-12 text-center text-muted-foreground">Tournament not found</div>;

  const recentMatches = matches.filter(m => m.status !== 'upcoming').slice(-3);
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 3);
  const liveMatches = matches.filter(m => m.status === 'live');

  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="cricket-gradient rounded-xl p-5 text-primary-foreground">
        <h1 className="font-display text-xl font-bold">{tournament.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm opacity-80">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tournament.location}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">{tournament.format}</Badge>
          <Badge variant="secondary" className="text-xs">{tournament.teamsCount} Teams</Badge>
          <Badge variant="secondary" className="text-xs">{tournament.matchesPlayed}/{tournament.totalMatches} Matches</Badge>
        </div>
      </div>

      {liveMatches.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-live live-pulse" /> Live Now
          </h2>
          {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <PointsTable teams={teams} />
          {recentMatches.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm mb-2">Recent Matches</h3>
              <div className="space-y-2">{recentMatches.map(m => <MatchCard key={m.id} match={m} />)}</div>
            </div>
          )}
          {upcomingMatches.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm mb-2">Upcoming</h3>
              <div className="space-y-2">{upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="teams" className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm">Teams ({teams.length})</h3>
            <Link to={`/tournament/${id}/teams`}>
              <Button size="sm" variant="outline" className="gap-1"><Users className="w-4 h-4" />Manage</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {teams.map(team => (
              <div key={team.id} className="bg-card rounded-lg border border-border p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-semibold text-sm">{team.name}</h4>
                  <p className="text-xs text-muted-foreground">Captain: {team.captain} · {team.players.length} players</p>
                </div>
                <Badge variant="secondary">{team.points} pts</Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm">All Matches ({matches.length})</h3>
            <Link to={`/tournament/${id}/matches`}>
              <Button size="sm" variant="outline" className="gap-1"><Swords className="w-4 h-4" />Manage</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <StatsCharts teams={teams} matches={matches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
