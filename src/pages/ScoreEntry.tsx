import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMatches, useTeams } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { Innings, BattingEntry, BowlingEntry } from '@/lib/types';

export default function ScoreEntry() {
  const { id, matchId } = useParams<{ id: string; matchId: string }>();
  const navigate = useNavigate();
  const { matches, updateMatch } = useMatches(id);
  const { teams } = useTeams(id);
  const match = matches.find(m => m.id === matchId);

  const [innings, setInnings] = useState<1 | 2>(1);
  const [runs, setRuns] = useState(match?.innings1?.totalRuns?.toString() || '');
  const [wickets, setWickets] = useState(match?.innings1?.totalWickets?.toString() || '');
  const [overs, setOvers] = useState(match?.innings1?.totalOvers?.toString() || '');
  const [runs2, setRuns2] = useState(match?.innings2?.totalRuns?.toString() || '');
  const [wickets2, setWickets2] = useState(match?.innings2?.totalWickets?.toString() || '');
  const [overs2, setOvers2] = useState(match?.innings2?.totalOvers?.toString() || '');

  if (!match) return <div className="container py-12 text-center text-muted-foreground">Match not found</div>;

  const handleSave = () => {
    const inn1: Innings = {
      teamId: match.team1Id, teamName: match.team1Name,
      totalRuns: parseInt(runs) || 0, totalWickets: parseInt(wickets) || 0,
      totalOvers: parseFloat(overs) || 0, batting: [], bowling: [],
    };
    const inn2: Innings = {
      teamId: match.team2Id, teamName: match.team2Name,
      totalRuns: parseInt(runs2) || 0, totalWickets: parseInt(wickets2) || 0,
      totalOvers: parseFloat(overs2) || 0, batting: [], bowling: [],
    };

    const updates: any = { innings1: inn1, innings2: inn2, status: 'live' as const };

    // Auto-calculate result if both innings have data
    if (inn1.totalRuns > 0 && inn2.totalRuns > 0 && inn2.totalOvers > 0) {
      if (inn1.totalRuns > inn2.totalRuns) {
        updates.winnerId = match.team1Id;
        updates.winnerName = match.team1Name;
        updates.result = `${match.team1Name} won by ${inn1.totalRuns - inn2.totalRuns} runs`;
        updates.status = 'completed';
      } else if (inn2.totalRuns > inn1.totalRuns) {
        updates.winnerId = match.team2Id;
        updates.winnerName = match.team2Name;
        updates.result = `${match.team2Name} won by ${10 - inn2.totalWickets} wickets`;
        updates.status = 'completed';
      } else {
        updates.result = 'Match tied';
        updates.status = 'completed';
      }
    }

    updateMatch(matchId!, updates);
    navigate(`/tournament/${id}/matches`);
  };

  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Link to={`/tournament/${id}/matches`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </Link>

      <div className="cricket-gradient rounded-xl p-4 text-primary-foreground">
        <h1 className="font-display text-lg font-bold">Score Entry</h1>
        <p className="text-sm opacity-80">{match.team1Name} vs {match.team2Name}</p>
        <p className="text-xs opacity-60 mt-1">{match.venue} · {match.overs} overs</p>
      </div>

      {/* 1st Innings */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h2 className="font-display font-semibold text-sm">1st Innings — {match.team1Name}</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Runs</Label>
            <Input type="number" placeholder="0" value={runs} onChange={e => setRuns(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Wickets</Label>
            <Input type="number" placeholder="0" max="10" value={wickets} onChange={e => setWickets(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Overs</Label>
            <Input type="number" step="0.1" placeholder="0.0" value={overs} onChange={e => setOvers(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 2nd Innings */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h2 className="font-display font-semibold text-sm">2nd Innings — {match.team2Name}</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Runs</Label>
            <Input type="number" placeholder="0" value={runs2} onChange={e => setRuns2(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Wickets</Label>
            <Input type="number" placeholder="0" max="10" value={wickets2} onChange={e => setWickets2(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Overs</Label>
            <Input type="number" step="0.1" placeholder="0.0" value={overs2} onChange={e => setOvers2(e.target.value)} />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full gap-2">
        <Save className="w-4 h-4" /> Save Score
      </Button>
    </div>
  );
}
