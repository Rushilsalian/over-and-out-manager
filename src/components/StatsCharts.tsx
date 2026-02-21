import { Team, Match } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(152, 55%, 24%)', 'hsl(38, 90%, 52%)', 'hsl(200, 60%, 45%)', 'hsl(340, 65%, 50%)', 'hsl(280, 50%, 55%)'];

export default function StatsCharts({ teams, matches }: { teams: Team[]; matches: Match[] }) {
  // Top batsmen by total runs across all players in teams
  const allPlayers = teams.flatMap(t => t.players.map(p => ({ ...p, teamName: t.name })));
  const topBatsmen = [...allPlayers].sort((a, b) => b.battingRuns - a.battingRuns).slice(0, 5);
  const topBowlers = [...allPlayers].sort((a, b) => b.wickets - a.wickets).slice(0, 5);

  const winsData = teams.map(t => ({ name: t.name, wins: t.wins, losses: t.losses }));
  const matchStatusData = [
    { name: 'Completed', value: matches.filter(m => m.status === 'completed').length },
    { name: 'Live', value: matches.filter(m => m.status === 'live').length },
    { name: 'Upcoming', value: matches.filter(m => m.status === 'upcoming').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-4">
      {/* Top Batsmen */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-display font-semibold text-sm mb-3">🏏 Top Batsmen</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topBatsmen} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
            <Tooltip />
            <Bar dataKey="battingRuns" fill="hsl(152, 55%, 24%)" radius={[0, 4, 4, 0]} name="Runs" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Bowlers */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-display font-semibold text-sm mb-3">🎳 Top Bowlers</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topBowlers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
            <Tooltip />
            <Bar dataKey="wickets" fill="hsl(38, 90%, 52%)" radius={[0, 4, 4, 0]} name="Wickets" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team Wins/Losses */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-display font-semibold text-sm mb-3">📊 Team Performance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={winsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="wins" fill="hsl(152, 60%, 40%)" name="Wins" radius={[4, 4, 0, 0]} />
            <Bar dataKey="losses" fill="hsl(0, 72%, 51%)" name="Losses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Match Status Pie */}
      {matchStatusData.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-display font-semibold text-sm mb-3">🎯 Match Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={matchStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {matchStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
