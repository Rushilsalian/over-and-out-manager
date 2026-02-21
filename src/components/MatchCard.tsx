import { Match } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

export default function MatchCard({ match, onClick }: { match: Match; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-4 transition-all animate-slide-up ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-primary/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        <Badge
          variant={match.status === 'live' ? 'destructive' : match.status === 'completed' ? 'default' : 'outline'}
          className={`text-xs ${match.status === 'live' ? 'live-pulse' : ''}`}
        >
          {match.status === 'live' ? '● LIVE' : match.status === 'completed' ? 'Completed' : 'Upcoming'}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-sm text-card-foreground">{match.team1Name}</span>
          {match.innings1 && (
            <span className="font-display font-bold text-sm text-card-foreground">
              {match.innings1.totalRuns}/{match.innings1.totalWickets}
              <span className="text-xs text-muted-foreground ml-1">({match.innings1.totalOvers})</span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-sm text-card-foreground">{match.team2Name}</span>
          {match.innings2 && (
            <span className="font-display font-bold text-sm text-card-foreground">
              {match.innings2.totalRuns}/{match.innings2.totalWickets}
              <span className="text-xs text-muted-foreground ml-1">({match.innings2.totalOvers})</span>
            </span>
          )}
        </div>
      </div>

      {match.result && (
        <p className="mt-2 text-xs text-primary font-medium">{match.result}</p>
      )}

      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{match.venue}</span>
      </div>
    </div>
  );
}
