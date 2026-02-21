import { Tournament, Team, Match, Player } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createPlayer = (name: string, role: Player['role']): Player => ({
  id: generateId(),
  name,
  role,
  battingRuns: Math.floor(Math.random() * 400),
  battingBalls: Math.floor(Math.random() * 300),
  fours: Math.floor(Math.random() * 30),
  sixes: Math.floor(Math.random() * 15),
  bowlingOvers: role === 'Batsman' ? 0 : Math.floor(Math.random() * 40),
  bowlingRuns: role === 'Batsman' ? 0 : Math.floor(Math.random() * 200),
  wickets: role === 'Batsman' ? 0 : Math.floor(Math.random() * 15),
});

export const mockTournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Summer Premier League 2026',
    location: 'Mumbai, India',
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    format: 'league',
    teamsCount: 6,
    matchesPlayed: 12,
    totalMatches: 15,
  },
  {
    id: 't2',
    name: 'Champions Cup T20',
    location: 'London, UK',
    startDate: '2026-05-10',
    endDate: '2026-05-25',
    format: 'knockout',
    teamsCount: 8,
    matchesPlayed: 0,
    totalMatches: 7,
  },
  {
    id: 't3',
    name: 'Weekend Warriors League',
    location: 'Sydney, Australia',
    startDate: '2026-01-10',
    endDate: '2026-02-20',
    format: 'league',
    teamsCount: 4,
    matchesPlayed: 6,
    totalMatches: 6,
  },
];

export const mockTeams: Team[] = [
  {
    id: 'tm1', tournamentId: 't1', name: 'Mumbai Strikers', captain: 'Rohit Sharma',
    players: [
      createPlayer('Rohit Sharma', 'Batsman'), createPlayer('Virat Kohli', 'Batsman'),
      createPlayer('Jasprit Bumrah', 'Bowler'), createPlayer('Ravindra Jadeja', 'All-rounder'),
      createPlayer('KL Rahul', 'Wicketkeeper'),
    ],
    wins: 4, losses: 1, draws: 0, points: 8, nrr: 1.25,
  },
  {
    id: 'tm2', tournamentId: 't1', name: 'Delhi Dragons', captain: 'Shikhar Dhawan',
    players: [
      createPlayer('Shikhar Dhawan', 'Batsman'), createPlayer('Rishabh Pant', 'Wicketkeeper'),
      createPlayer('Axar Patel', 'All-rounder'), createPlayer('Mohammed Shami', 'Bowler'),
      createPlayer('Shreyas Iyer', 'Batsman'),
    ],
    wins: 3, losses: 2, draws: 0, points: 6, nrr: 0.85,
  },
  {
    id: 'tm3', tournamentId: 't1', name: 'Chennai Kings', captain: 'MS Dhoni',
    players: [
      createPlayer('MS Dhoni', 'Wicketkeeper'), createPlayer('Suresh Raina', 'Batsman'),
      createPlayer('Deepak Chahar', 'Bowler'), createPlayer('Ravichandran Ashwin', 'Bowler'),
      createPlayer('Ambati Rayudu', 'Batsman'),
    ],
    wins: 3, losses: 1, draws: 1, points: 7, nrr: 0.62,
  },
  {
    id: 'tm4', tournamentId: 't1', name: 'Kolkata Riders', captain: 'Andre Russell',
    players: [
      createPlayer('Andre Russell', 'All-rounder'), createPlayer('Sunil Narine', 'Bowler'),
      createPlayer('Shubman Gill', 'Batsman'), createPlayer('Pat Cummins', 'Bowler'),
      createPlayer('Nitish Rana', 'Batsman'),
    ],
    wins: 2, losses: 3, draws: 0, points: 4, nrr: -0.35,
  },
];

export const mockMatches: Match[] = [
  {
    id: 'm1', tournamentId: 't1', team1Id: 'tm1', team1Name: 'Mumbai Strikers',
    team2Id: 'tm2', team2Name: 'Delhi Dragons', date: '2026-03-05', venue: 'Wankhede Stadium',
    overs: 20, status: 'completed',
    innings1: {
      teamId: 'tm1', teamName: 'Mumbai Strikers', totalRuns: 185, totalWickets: 4, totalOvers: 20,
      batting: [
        { playerId: 'p1', playerName: 'Rohit Sharma', runs: 72, balls: 45, fours: 8, sixes: 4 },
        { playerId: 'p2', playerName: 'Virat Kohli', runs: 56, balls: 38, fours: 5, sixes: 2 },
      ],
      bowling: [],
    },
    innings2: {
      teamId: 'tm2', teamName: 'Delhi Dragons', totalRuns: 172, totalWickets: 7, totalOvers: 20,
      batting: [
        { playerId: 'p3', playerName: 'Shikhar Dhawan', runs: 48, balls: 35, fours: 6, sixes: 1 },
      ],
      bowling: [],
    },
    winnerId: 'tm1', winnerName: 'Mumbai Strikers', result: 'Mumbai Strikers won by 13 runs',
  },
  {
    id: 'm2', tournamentId: 't1', team1Id: 'tm3', team1Name: 'Chennai Kings',
    team2Id: 'tm4', team2Name: 'Kolkata Riders', date: '2026-03-08', venue: 'MA Chidambaram Stadium',
    overs: 20, status: 'live',
    innings1: {
      teamId: 'tm3', teamName: 'Chennai Kings', totalRuns: 156, totalWickets: 6, totalOvers: 20,
      batting: [], bowling: [],
    },
    innings2: {
      teamId: 'tm4', teamName: 'Kolkata Riders', totalRuns: 98, totalWickets: 3, totalOvers: 12.3,
      batting: [], bowling: [],
    },
  },
  {
    id: 'm3', tournamentId: 't1', team1Id: 'tm1', team1Name: 'Mumbai Strikers',
    team2Id: 'tm3', team2Name: 'Chennai Kings', date: '2026-03-15', venue: 'Wankhede Stadium',
    overs: 20, status: 'upcoming',
  },
  {
    id: 'm4', tournamentId: 't1', team1Id: 'tm2', team1Name: 'Delhi Dragons',
    team2Id: 'tm4', team2Name: 'Kolkata Riders', date: '2026-03-18', venue: 'Arun Jaitley Stadium',
    overs: 20, status: 'upcoming',
  },
];
