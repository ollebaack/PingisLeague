import { useEffect, useState, type ChangeEvent } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { usePlayers } from "../app/providers/players-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
// Command primitives are used by the Combobox component

export function GameForm() {
  const { players, addGame } = usePlayers();
  const [playerA, setPlayerA] = useState<string | undefined>(players[0]?.id);
  const [playerB, setPlayerB] = useState<string | undefined>(players[1]?.id);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);

  useEffect(() => {
    if (!playerA && players[0]) setPlayerA(players[0].id);
    if (!playerB && players[1]) setPlayerB(players[1].id);
  }, [players]);

  const submit = () => {
    // --- PLAYER VALIDATION ---
    if (!playerA || !playerB) return showError("Please select both players");
    if (playerA === playerB) return showError("Players must be different");

    // --- SCORE VALIDATION ---
    if (isNaN(scoreA) || isNaN(scoreB))
      return showError("Scores must be numbers");

    if (scoreA < 0 || scoreB < 0) return showError("Scores cannot be negative");

    if (scoreA === 0 && scoreB === 0)
      return showError("At least one player must have a non-zero score");

    if (scoreA === scoreB) return showError("Game cannot end in a draw");

    if (scoreA > 1000 || scoreB > 1000)
      return showError("Scores are unrealistically high — please check again");

    // --- GAME CREATION ---
    addGame({
      playerAId: playerA,
      playerBId: playerB,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
    });

    // --- RESET STATE ---
    setScoreA(0);
    setScoreB(0);
    showSuccess("Game recorded");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Player A</label>
              <Combobox
                items={players.map((p) => ({ id: p.id, label: p.name }))}
                value={playerA}
                onValueChange={(v) => setPlayerA(v)}
                placeholder="Select player A..."
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Player B</label>
              <Combobox
                items={players.map((p) => ({ id: p.id, label: p.name }))}
                value={playerB}
                onValueChange={(v) => setPlayerB(v)}
                placeholder="Select player B..."
                exclude={(id) => id === playerA}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Score A</label>
              <Input
                type="number"
                value={scoreA}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setScoreA(Number(e.target.value))
                }
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Score B</label>
              <Input
                type="number"
                value={scoreB}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setScoreB(Number(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end">
          <Button onClick={submit}>Save Game</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
