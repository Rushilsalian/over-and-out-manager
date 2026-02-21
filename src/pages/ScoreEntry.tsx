import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useMatches, useTeams } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Innings, BattingEntry, BowlingEntry, Player } from '@/lib/types';
import { toast } from 'sonner';

interface BattingRow extends BattingEntry {
  _key: string;
}
interface BowlingRow extends BowlingEntry {
  _key: string;
}

function genKey() {
  return Math.random().toString(36).slice(2, 9);
}

function initBattingRows(existing: BattingEntry[]): BattingRow[] {
  if (existing.length > 0) return existing.map(e => ({ ...e, _key: genKey() }));
  return [];
}
function initBowlingRows(existing: BowlingEntry[]): BowlingRow[] {
  if (existing.length > 0) return existing.map(e => ({ ...e, _key: genKey() }));
  return [];
}

export default function ScoreEntry() {
  const { id, matchId } = useParams<{ id: string; matchId: string }>();
  const navigate = useNavigate();
  const { matches, updateMatch } = useMatches(id);
  const { teams } = useTeams(id);
  const match = matches.find(m => m.id === matchId);

  const team1 = teams.find(t => t.id === match?.team1Id);
  const team2 = teams.find(t => t.id === match?.team2Id);

  // Innings 1 state
  const [batting1, setBatting1] = useState<BattingRow[]>(() => initBattingRows(match?.innings1?.batting || []));
  const [bowling1, setBowling1] = useState<BowlingRow[]>(() => initBowlingRows(match?.innings1?.bowling || []));

  // Innings 2 state
  const [batting2, setBatting2] = useState<BattingRow[]>(() => initBattingRows(match?.innings2?.batting || []));
  const [bowling2, setBowling2] = useState<BowlingRow[]>(() => initBowlingRows(match?.innings2?.bowling || []));

  // Collapse state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    bat1: true, bowl1: true, bat2: false, bowl2: false,
  });

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  if (!match) return <div className="container py-12 text-center text-muted-foreground">Match not found</div>;

  // Helpers to compute totals from individual entries
  const computeInnings = (
    teamId: string, teamName: string,
    batRows: BattingRow[], bowlRows: BowlingRow[]
  ): Innings => {
    const totalRuns = batRows.reduce((s, b) => s + b.runs, 0);
    const totalWickets = bowlRows.reduce((s, b) => s + b.wickets, 0);
    const totalOvers = bowlRows.reduce((s, b) => s + b.overs, 0);
    return {
      teamId, teamName, totalRuns, totalWickets, totalOvers,
      batting: batRows.map(({ _key, ...rest }) => rest),
      bowling: bowlRows.map(({ _key, ...rest }) => rest),
    };
  };

  const addBattingRow = (setter: React.Dispatch<React.SetStateAction<BattingRow[]>>) => {
    setter(prev => [...prev, { _key: genKey(), playerId: '', playerName: '', runs: 0, balls: 0, fours: 0, sixes: 0 }]);
  };

  const addBowlingRow = (setter: React.Dispatch<React.SetStateAction<BowlingRow[]>>) => {
    setter(prev => [...prev, { _key: genKey(), playerId: '', playerName: '', overs: 0, runs: 0, wickets: 0 }]);
  };

  const removeBattingRow = (setter: React.Dispatch<React.SetStateAction<BattingRow[]>>, key: string) => {
    setter(prev => prev.filter(r => r._key !== key));
  };

  const removeBowlingRow = (setter: React.Dispatch<React.SetStateAction<BowlingRow[]>>, key: string) => {
    setter(prev => prev.filter(r => r._key !== key));
  };

  const updateBatRow = (setter: React.Dispatch<React.SetStateAction<BattingRow[]>>, key: string, field: keyof BattingEntry, value: string) => {
    setter(prev => prev.map(r => {
      if (r._key !== key) return r;
      if (field === 'playerName') {
        return { ...r, playerName: value };
      }
      return { ...r, [field]: parseInt(value) || 0 };
    }));
  };

  const updateBowlRow = (setter: React.Dispatch<React.SetStateAction<BowlingRow[]>>, key: string, field: keyof BowlingEntry, value: string) => {
    setter(prev => prev.map(r => {
      if (r._key !== key) return r;
      if (field === 'playerName') {
        return { ...r, playerName: value };
      }
      if (field === 'overs') {
        return { ...r, overs: parseFloat(value) || 0 };
      }
      return { ...r, [field]: parseInt(value) || 0 };
    }));
  };

  const selectPlayer = (
    setter: React.Dispatch<React.SetStateAction<BattingRow[]>> | React.Dispatch<React.SetStateAction<BowlingRow[]>>,
    key: string,
    player: Player,
    type: 'bat' | 'bowl'
  ) => {
    if (type === 'bat') {
      (setter as React.Dispatch<React.SetStateAction<BattingRow[]>>)(prev =>
        prev.map(r => r._key === key ? { ...r, playerId: player.id, playerName: player.name } : r)
      );
    } else {
      (setter as React.Dispatch<React.SetStateAction<BowlingRow[]>>)(prev =>
        prev.map(r => r._key === key ? { ...r, playerId: player.id, playerName: player.name } : r)
      );
    }
  };

  const handleSave = () => {
    const inn1 = computeInnings(match.team1Id, match.team1Name, batting1, bowling1);
    const inn2 = computeInnings(match.team2Id, match.team2Name, batting2, bowling2);

    const updates: any = { innings1: inn1, innings2: inn2, status: 'live' as const };

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
    toast.success('Scorecard saved!');
    navigate(`/tournament/${id}/matches`);
  };

  // Summary stats
  const inn1Runs = batting1.reduce((s, b) => s + b.runs, 0);
  const inn1Wkts = bowling1.reduce((s, b) => s + b.wickets, 0);
  const inn1Overs = bowling1.reduce((s, b) => s + b.overs, 0);
  const inn2Runs = batting2.reduce((s, b) => s + b.runs, 0);
  const inn2Wkts = bowling2.reduce((s, b) => s + b.wickets, 0);
  const inn2Overs = bowling2.reduce((s, b) => s + b.overs, 0);

  return (
    <div className="container max-w-2xl py-4 space-y-4 pb-24">
      <Link to={`/tournament/${id}/matches`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </Link>

      <div className="cricket-gradient rounded-xl p-4 text-primary-foreground">
        <h1 className="font-display text-lg font-bold">Scorecard Entry</h1>
        <p className="text-sm opacity-80">{match.team1Name} vs {match.team2Name}</p>
        <p className="text-xs opacity-60 mt-1">{match.venue} · {match.overs} overs</p>
      </div>

      {/* ===== 1st INNINGS ===== */}
      <InningsSection
        title={`1st Innings — ${match.team1Name}`}
        summary={`${inn1Runs}/${inn1Wkts} (${inn1Overs} ov)`}
        battingRows={batting1}
        bowlingRows={bowling1}
        battingPlayers={team1?.players || []}
        bowlingPlayers={team2?.players || []}
        setBatting={setBatting1}
        setBowling={setBowling1}
        expanded={expanded}
        toggle={toggle}
        batKey="bat1"
        bowlKey="bowl1"
        addBattingRow={addBattingRow}
        addBowlingRow={addBowlingRow}
        removeBattingRow={removeBattingRow}
        removeBowlingRow={removeBowlingRow}
        updateBatRow={updateBatRow}
        updateBowlRow={updateBowlRow}
        selectPlayer={selectPlayer}
      />

      {/* ===== 2nd INNINGS ===== */}
      <InningsSection
        title={`2nd Innings — ${match.team2Name}`}
        summary={`${inn2Runs}/${inn2Wkts} (${inn2Overs} ov)`}
        battingRows={batting2}
        bowlingRows={bowling2}
        battingPlayers={team2?.players || []}
        bowlingPlayers={team1?.players || []}
        setBatting={setBatting2}
        setBowling={setBowling2}
        expanded={expanded}
        toggle={toggle}
        batKey="bat2"
        bowlKey="bowl2"
        addBattingRow={addBattingRow}
        addBowlingRow={addBowlingRow}
        removeBattingRow={removeBattingRow}
        removeBowlingRow={removeBowlingRow}
        updateBatRow={updateBatRow}
        updateBowlRow={updateBowlRow}
        selectPlayer={selectPlayer}
      />

      <Button onClick={handleSave} className="w-full gap-2 sticky bottom-4">
        <Save className="w-4 h-4" /> Save Scorecard
      </Button>
    </div>
  );
}

/* ── Innings Section Component ── */
function InningsSection({
  title, summary,
  battingRows, bowlingRows,
  battingPlayers, bowlingPlayers,
  setBatting, setBowling,
  expanded, toggle, batKey, bowlKey,
  addBattingRow, addBowlingRow,
  removeBattingRow, removeBowlingRow,
  updateBatRow, updateBowlRow,
  selectPlayer,
}: {
  title: string;
  summary: string;
  battingRows: BattingRow[];
  bowlingRows: BowlingRow[];
  battingPlayers: Player[];
  bowlingPlayers: Player[];
  setBatting: React.Dispatch<React.SetStateAction<BattingRow[]>>;
  setBowling: React.Dispatch<React.SetStateAction<BowlingRow[]>>;
  expanded: Record<string, boolean>;
  toggle: (k: string) => void;
  batKey: string;
  bowlKey: string;
  addBattingRow: (s: React.Dispatch<React.SetStateAction<BattingRow[]>>) => void;
  addBowlingRow: (s: React.Dispatch<React.SetStateAction<BowlingRow[]>>) => void;
  removeBattingRow: (s: React.Dispatch<React.SetStateAction<BattingRow[]>>, k: string) => void;
  removeBowlingRow: (s: React.Dispatch<React.SetStateAction<BowlingRow[]>>, k: string) => void;
  updateBatRow: (s: React.Dispatch<React.SetStateAction<BattingRow[]>>, k: string, f: keyof BattingEntry, v: string) => void;
  updateBowlRow: (s: React.Dispatch<React.SetStateAction<BowlingRow[]>>, k: string, f: keyof BowlingEntry, v: string) => void;
  selectPlayer: (s: any, k: string, p: Player, t: 'bat' | 'bowl') => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-muted/50 flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm">{title}</h2>
        <span className="font-display font-bold text-sm text-primary">{summary}</span>
      </div>

      {/* Batting */}
      <div className="border-t border-border">
        <button onClick={() => toggle(batKey)} className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">🏏 Batting ({battingRows.length})</span>
          {expanded[batKey] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expanded[batKey] && (
          <div className="px-3 pb-3 space-y-2">
            {/* Header row */}
            {battingRows.length > 0 && (
              <div className="grid grid-cols-[1fr_50px_50px_40px_40px_28px] gap-1 text-[10px] font-semibold text-muted-foreground uppercase px-1">
                <span>Batter</span><span>R</span><span>B</span><span>4s</span><span>6s</span><span></span>
              </div>
            )}
            {battingRows.map(row => (
              <div key={row._key} className="grid grid-cols-[1fr_50px_50px_40px_40px_28px] gap-1 items-center">
                <Select value={row.playerId} onValueChange={val => {
                  const p = battingPlayers.find(pl => pl.id === val);
                  if (p) selectPlayer(setBatting, row._key, p, 'bat');
                }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {battingPlayers.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.runs || ''} onChange={e => updateBatRow(setBatting, row._key, 'runs', e.target.value)} placeholder="0" />
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.balls || ''} onChange={e => updateBatRow(setBatting, row._key, 'balls', e.target.value)} placeholder="0" />
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.fours || ''} onChange={e => updateBatRow(setBatting, row._key, 'fours', e.target.value)} placeholder="0" />
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.sixes || ''} onChange={e => updateBatRow(setBatting, row._key, 'sixes', e.target.value)} placeholder="0" />
                <button onClick={() => removeBattingRow(setBatting, row._key)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => addBattingRow(setBatting)}>
              <Plus className="w-3 h-3" /> Add Batter
            </Button>
          </div>
        )}
      </div>

      {/* Bowling */}
      <div className="border-t border-border">
        <button onClick={() => toggle(bowlKey)} className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">🎳 Bowling ({bowlingRows.length})</span>
          {expanded[bowlKey] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expanded[bowlKey] && (
          <div className="px-3 pb-3 space-y-2">
            {bowlingRows.length > 0 && (
              <div className="grid grid-cols-[1fr_50px_50px_50px_28px] gap-1 text-[10px] font-semibold text-muted-foreground uppercase px-1">
                <span>Bowler</span><span>Ov</span><span>R</span><span>W</span><span></span>
              </div>
            )}
            {bowlingRows.map(row => (
              <div key={row._key} className="grid grid-cols-[1fr_50px_50px_50px_28px] gap-1 items-center">
                <Select value={row.playerId} onValueChange={val => {
                  const p = bowlingPlayers.find(pl => pl.id === val);
                  if (p) selectPlayer(setBowling, row._key, p, 'bowl');
                }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bowlingPlayers.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" step="0.1" className="h-8 text-xs text-center px-1" value={row.overs || ''} onChange={e => updateBowlRow(setBowling, row._key, 'overs', e.target.value)} placeholder="0" />
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.runs || ''} onChange={e => updateBowlRow(setBowling, row._key, 'runs', e.target.value)} placeholder="0" />
                <Input type="number" className="h-8 text-xs text-center px-1" value={row.wickets || ''} onChange={e => updateBowlRow(setBowling, row._key, 'wickets', e.target.value)} placeholder="0" />
                <button onClick={() => removeBowlingRow(setBowling, row._key)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => addBowlingRow(setBowling)}>
              <Plus className="w-3 h-3" /> Add Bowler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
