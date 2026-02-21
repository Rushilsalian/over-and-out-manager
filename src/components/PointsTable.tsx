import { Team } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PointsTable({ teams }: { teams: Team[] }) {
  const sorted = [...teams].sort((a, b) => b.points - a.points || b.nrr - a.nrr);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="cricket-gradient px-4 py-2">
        <h3 className="font-display font-semibold text-sm text-primary-foreground">Points Table</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs w-8">#</TableHead>
            <TableHead className="text-xs">Team</TableHead>
            <TableHead className="text-xs text-center">W</TableHead>
            <TableHead className="text-xs text-center">L</TableHead>
            <TableHead className="text-xs text-center">Pts</TableHead>
            <TableHead className="text-xs text-right">NRR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((team, i) => (
            <TableRow key={team.id}>
              <TableCell className="text-xs font-medium">{i + 1}</TableCell>
              <TableCell className="text-xs font-display font-medium">{team.name}</TableCell>
              <TableCell className="text-xs text-center text-success">{team.wins}</TableCell>
              <TableCell className="text-xs text-center text-destructive">{team.losses}</TableCell>
              <TableCell className="text-xs text-center font-bold">{team.points}</TableCell>
              <TableCell className="text-xs text-right">{team.nrr > 0 ? '+' : ''}{team.nrr.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
