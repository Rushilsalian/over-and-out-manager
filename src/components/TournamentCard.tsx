import { Link } from 'react-router-dom';
import { Tournament } from '@/lib/types';
import { MapPin, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
  const progress = tournament.totalMatches > 0
    ? Math.round((tournament.matchesPlayed / tournament.totalMatches) * 100) : 0;
  const isComplete = tournament.matchesPlayed === tournament.totalMatches && tournament.totalMatches > 0;
  const isUpcoming = tournament.matchesPlayed === 0;

  return (
    <Link to={`/tournament/${tournament.id}`}>
      <div className="bg-card rounded-lg border border-border p-4 hover:shadow-lg transition-all hover:border-primary/30 animate-slide-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-card-foreground text-base leading-tight">
              {tournament.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="w-3 h-3" />
              <span>{tournament.location}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={tournament.format === 'league' ? 'default' : 'secondary'} className="text-xs">
              {tournament.format === 'league' ? 'League' : 'Knockout'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {tournament.teamsCount} teams
            </span>
          </div>
          <Badge variant={isComplete ? 'default' : isUpcoming ? 'outline' : 'secondary'} className="text-xs">
            {isComplete ? 'Completed' : isUpcoming ? 'Upcoming' : `${progress}%`}
          </Badge>
        </div>

        {!isUpcoming && !isComplete && (
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full cricket-gradient rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}
