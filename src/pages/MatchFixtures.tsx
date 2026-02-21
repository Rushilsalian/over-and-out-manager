import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useMatches, useTeams } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { Match } from '@/lib/types';

export default function MatchFixtures() {
  const { id } = useParams<{ id: string }>();
  const { matches, addMatch } = useMatches(id);
  const { teams } = useTeams(id);
  const [open, setOpen] = useState(false);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [overs, setOvers] = useState('20');

  const handleCreate = () => {
    if (!team1Id || !team2Id || !date || !venue || !id) return;
    const t1 = teams.find(t => t.id === team1Id);
    const t2 = teams.find(t => t.id === team2Id);
    if (!t1 || !t2) return;
    const match: Match = {
      id: 'm' + Date.now(), tournamentId: id,
      team1Id, team1Name: t1.name, team2Id, team2Name: t2.name,
      date, venue, overs: parseInt(overs), status: 'upcoming',
    };
    addMatch(match);
    setOpen(false);
    setTeam1Id(''); setTeam2Id(''); setDate(''); setVenue('');
  };

  const upcoming = matches.filter(m => m.status === 'upcoming');
  const live = matches.filter(m => m.status === 'live');
  const completed = matches.filter(m => m.status === 'completed');

  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Link to={`/tournament/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Tournament
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Match Fixtures</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> New Match</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Create Match</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Team 1</Label>
                <Select value={team1Id} onValueChange={setTeam1Id}>
                  <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                  <SelectContent>
                    {teams.filter(t => t.id !== team2Id).map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Team 2</Label>
                <Select value={team2Id} onValueChange={setTeam2Id}>
                  <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                  <SelectContent>
                    {teams.filter(t => t.id !== team1Id).map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div><Label>Overs</Label><Input type="number" value={overs} onChange={e => setOvers(e.target.value)} /></div>
              </div>
              <div><Label>Venue</Label><Input placeholder="e.g. Wankhede Stadium" value={venue} onChange={e => setVenue(e.target.value)} /></div>
              <Button onClick={handleCreate} className="w-full">Create Match</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {live.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-live live-pulse" /> Live
          </h2>
          <div className="space-y-2">{live.map(m => (
            <Link key={m.id} to={`/tournament/${id}/score/${m.id}`}><MatchCard match={m} /></Link>
          ))}</div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-sm mb-2">Upcoming ({upcoming.length})</h2>
          <div className="space-y-2">{upcoming.map(m => (
            <Link key={m.id} to={`/tournament/${id}/score/${m.id}`}><MatchCard match={m} /></Link>
          ))}</div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-sm mb-2">Completed ({completed.length})</h2>
          <div className="space-y-2">{completed.map(m => <MatchCard key={m.id} match={m} />)}</div>
        </div>
      )}
    </div>
  );
}
