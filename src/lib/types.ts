export type TournamentFormat = 'league' | 'knockout';
export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';

export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  format: TournamentFormat;
  teamsCount: number;
  matchesPlayed: number;
  totalMatches: number;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  battingRuns: number;
  battingBalls: number;
  fours: number;
  sixes: number;
  bowlingOvers: number;
  bowlingRuns: number;
  wickets: number;
}

export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  captain: string;
  players: Player[];
  wins: number;
  losses: number;
  draws: number;
  points: number;
  nrr: number;
}

export interface BattingEntry {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

export interface BowlingEntry {
  playerId: string;
  playerName: string;
  overs: number;
  runs: number;
  wickets: number;
}

export interface Innings {
  teamId: string;
  teamName: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  batting: BattingEntry[];
  bowling: BowlingEntry[];
}

export interface Match {
  id: string;
  tournamentId: string;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  date: string;
  venue: string;
  overs: number;
  status: MatchStatus;
  innings1?: Innings;
  innings2?: Innings;
  winnerId?: string;
  winnerName?: string;
  result?: string;
}
