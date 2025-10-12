import { usePlayers } from "../state";
import { Card } from "@/components/ui/card";

export function Leaderboard() {
  const { getLeaderboard } = usePlayers();
  const rows = getLeaderboard();

  return (
    <Card>
      <h3>Leaderboard</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>W</th>
            <th>L</th>
            <th>M</th>
            <th>PF</th>
            <th>PA</th>
            <th>Diff</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.player.id}>
              <td>{i + 1}</td>
              <td>{r.player.name}</td>
              <td>{r.wins}</td>
              <td>{r.losses}</td>
              <td>{r.matches}</td>
              <td>{r.pointsFor}</td>
              <td>{r.pointsAgainst}</td>
              <td>{r.pointDiff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
