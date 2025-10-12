import { useEffect, useState, type ChangeEvent } from "react";
import { showError } from "@/lib/toast";
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
  const [scoreA, setScoreA] = useState<number>(11);
  const [scoreB, setScoreB] = useState<number>(9);

  useEffect(() => {
    if (!playerA && players[0]) setPlayerA(players[0].id);
    if (!playerB && players[1]) setPlayerB(players[1].id);
  }, [players]);

  const submit = () => {
    if (!playerA || !playerB || playerA === playerB)
      return showError("Please select two different players");
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
