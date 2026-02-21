import { useState } from 'react';
import { Plus, Trophy, MapPin, Calendar } from 'lucide-react';
import { useTournaments } from '@/lib/store';
import TournamentCard from '@/components/TournamentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tournament, TournamentFormat } from '@/lib/types';

export default function HomePage() {
  const { tournaments, addTournament } = useTournaments();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('league');

  const handleCreate = () => {
    if (!name || !location || !startDate || !endDate) return;
    const t: Tournament = {
      id: 't' + Date.now(),
      name,
      location,
      startDate,
      endDate,
      format,
      teamsCount: 0,
      matchesPlayed: 0,
      totalMatches: 0,
    };
    addTournament(t);
    setOpen(false);
    setName(''); setLocation(''); setStartDate(''); setEndDate('');
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      {/* Hero Section */}
      <div className="cricket-gradient rounded-xl p-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">CrickHub</h1>
            <p className="text-sm opacity-80">Manage your cricket tournaments</p>
          </div>
        </div>
      </div>

      {/* Tournament List */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Tournaments</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Create Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tournament Name</Label>
                <Input placeholder="e.g. Summer T20 League" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="e.g. Mumbai, India" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as TournamentFormat)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="knockout">Knockout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">Create Tournament</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tournaments.map(t => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
        {tournaments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-display font-medium">No tournaments yet</p>
            <p className="text-sm">Create your first tournament to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
