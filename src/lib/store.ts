import { useState, useCallback } from 'react';
import { Tournament, Team, Match } from './types';
import { mockTournaments, mockTeams, mockMatches } from './mock-data';

const STORAGE_KEYS = {
  tournaments: 'crickhub_tournaments',
  teams: 'crickhub_teams',
  matches: 'crickhub_matches',
};

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    loadFromStorage(STORAGE_KEYS.tournaments, mockTournaments)
  );

  const addTournament = useCallback((t: Tournament) => {
    setTournaments(prev => {
      const next = [...prev, t];
      saveToStorage(STORAGE_KEYS.tournaments, next);
      return next;
    });
  }, []);

  return { tournaments, addTournament };
}

export function useTeams(tournamentId?: string) {
  const [teams, setTeams] = useState<Team[]>(() =>
    loadFromStorage(STORAGE_KEYS.teams, mockTeams)
  );

  const filtered = tournamentId ? teams.filter(t => t.tournamentId === tournamentId) : teams;

  const addTeam = useCallback((t: Team) => {
    setTeams(prev => {
      const next = [...prev, t];
      saveToStorage(STORAGE_KEYS.teams, next);
      return next;
    });
  }, []);

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      saveToStorage(STORAGE_KEYS.teams, next);
      return next;
    });
  }, []);

  return { teams: filtered, allTeams: teams, addTeam, updateTeam };
}

export function useMatches(tournamentId?: string) {
  const [matches, setMatches] = useState<Match[]>(() =>
    loadFromStorage(STORAGE_KEYS.matches, mockMatches)
  );

  const filtered = tournamentId ? matches.filter(m => m.tournamentId === tournamentId) : matches;

  const addMatch = useCallback((m: Match) => {
    setMatches(prev => {
      const next = [...prev, m];
      saveToStorage(STORAGE_KEYS.matches, next);
      return next;
    });
  }, []);

  const updateMatch = useCallback((id: string, updates: Partial<Match>) => {
    setMatches(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updates } : m);
      saveToStorage(STORAGE_KEYS.matches, next);
      return next;
    });
  }, []);

  return { matches: filtered, allMatches: matches, addMatch, updateMatch };
}
