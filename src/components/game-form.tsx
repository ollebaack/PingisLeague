import { useEffect, useState, type ChangeEvent } from "react";
import { usePlayers } from "../app/providers/players-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function GameForm() {
  const { players, addGame } = usePlayers();
  const [playerA, setPlayerA] = useState<string | undefined>(players[0]?.id);
  const [playerB, setPlayerB] = useState<string | undefined>(players[1]?.id);
  const [scoreA, setScoreA] = useState<number>(11);
  const [scoreB, setScoreB] = useState<number>(9);

  useEffect(() => {
    if (!playerA && players[0]) setPlayerA(players[0].id);
    if (!playerB && players[1]) setPlayerB(players[1].id);
  }, [players]);

  const submit = () => {
    if (!playerA || !playerB || playerA === playerB)
      return alert("Select two different players");
    addGame({
      playerAId: playerA,
      playerBId: playerB,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
    });
    setScoreA(11);
    setScoreB(9);
  };

  return (
    <Card>
      <h3>Record Game</h3>
      <div style={{ display: "grid", gap: 8 }}>
        <div>
          <label>Player A</label>
          <select
            value={playerA}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayerA(e.target.value)
            }
          >
            <option value="">— select —</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Player B</label>
          <select
            value={playerB}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayerB(e.target.value)
            }
          >
            <option value="">— select —</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div>
            <label>Score A</label>
            <input
              type="number"
              value={scoreA}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setScoreA(Number(e.target.value))
              }
            />
          </div>
          <div>
            <label>Score B</label>
            <input
              type="number"
              value={scoreB}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setScoreB(Number(e.target.value))
              }
            />
          </div>
        </div>
        <Button onClick={submit}>Save Game</Button>
      </div>
    </Card>
  );
}
