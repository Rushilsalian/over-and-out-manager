import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useTeams } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, UserPlus, Trash2 } from 'lucide-react';
import { Team, Player, PlayerRole } from '@/lib/types';

export default function TeamManagement() {
  const { id } = useParams<{ id: string }>();
  const { teams, addTeam, updateTeam } = useTeams(id);
  const [teamOpen, setTeamOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [captain, setCaptain] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<PlayerRole>('Batsman');

  const handleAddTeam = () => {
    if (!teamName || !captain || !id) return;
    const team: Team = {
      id: 'tm' + Date.now(), tournamentId: id, name: teamName, captain,
      players: [], wins: 0, losses: 0, draws: 0, points: 0, nrr: 0,
    };
    addTeam(team);
    setTeamOpen(false);
    setTeamName(''); setCaptain('');
  };

  const handleAddPlayer = () => {
    if (!playerName || !selectedTeamId) return;
    const team = teams.find(t => t.id === selectedTeamId);
    if (!team) return;
    const player: Player = {
      id: 'p' + Date.now(), name: playerName, role: playerRole,
      battingRuns: 0, battingBalls: 0, fours: 0, sixes: 0,
      bowlingOvers: 0, bowlingRuns: 0, wickets: 0,
    };
    updateTeam(selectedTeamId, { players: [...team.players, player] });
    setPlayerOpen(false);
    setPlayerName('');
  };

  const handleRemovePlayer = (teamId: string, playerId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    updateTeam(teamId, { players: team.players.filter(p => p.id !== playerId) });
  };

  const roleColor = (role: PlayerRole) => {
    switch (role) {
      case 'Batsman': return 'default';
      case 'Bowler': return 'secondary';
      case 'All-rounder': return 'outline';
      case 'Wicketkeeper': return 'destructive';
    }
  };

  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Link to={`/tournament/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Tournament
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Team Management</h1>
        <Dialog open={teamOpen} onOpenChange={setTeamOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Add Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Add Team</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Team Name</Label><Input placeholder="e.g. Mumbai Strikers" value={teamName} onChange={e => setTeamName(e.target.value)} /></div>
              <div><Label>Captain</Label><Input placeholder="e.g. Rohit Sharma" value={captain} onChange={e => setCaptain(e.target.value)} /></div>
              <Button onClick={handleAddTeam} className="w-full">Add Team</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">Captain: {team.captain}</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedTeamId(team.id); setPlayerOpen(true); }}>
                <UserPlus className="w-4 h-4" /> Add Player
              </Button>
            </div>
            
            {team.players.length > 0 ? (
              <div className="space-y-1">
                {team.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{player.name}</span>
                      <Badge variant={roleColor(player.role)} className="text-[10px]">{player.role}</Badge>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemovePlayer(team.id, player.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-3">No players added yet</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Add Player</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Player Name</Label><Input placeholder="e.g. Virat Kohli" value={playerName} onChange={e => setPlayerName(e.target.value)} /></div>
            <div>
              <Label>Role</Label>
              <Select value={playerRole} onValueChange={v => setPlayerRole(v as PlayerRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicketkeeper">Wicketkeeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPlayer} className="w-full">Add Player</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
