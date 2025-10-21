import { usePlayers } from "../app/providers/players-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TableCaption } from "@/components/ui/table";

export function Leaderboard() {
  const { getLeaderboard } = usePlayers();
  const rows = getLeaderboard();

  return (
    <Card>
      <CardHeader>Leaderboard</CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Players sorted by wins, then point difference
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">W</TableHead>
              <TableHead className="text-right">L</TableHead>
              <TableHead className="text-right">M</TableHead>
              <TableHead className="text-right">PF</TableHead>
              <TableHead className="text-right">PA</TableHead>
              <TableHead className="text-right">Diff</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-6">
                  No players or games yet. Add players and record games to see
                  the leaderboard.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r, i) => (
                <TableRow key={r.player.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{r.player.name}</TableCell>
                  <TableCell className="text-right">{r.wins}</TableCell>
                  <TableCell className="text-right">{r.losses}</TableCell>
                  <TableCell className="text-right">{r.matches}</TableCell>
                  <TableCell className="text-right">{r.pointsFor}</TableCell>
                  <TableCell className="text-right">
                    {r.pointsAgainst}
                  </TableCell>
                  <TableCell className="text-right">{r.pointDiff}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
