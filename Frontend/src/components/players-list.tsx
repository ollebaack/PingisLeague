import { useState, type ChangeEvent, useRef } from "react";
import { usePlayers } from "../app/providers/players-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function PlayersList() {
  const { players, addPlayer, removePlayer } = usePlayers();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addPlayer(trimmed);
    setName("");
    // return focus to input for fast entry
    inputRef.current?.focus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            ref={inputRef}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="New player name"
            aria-label="New player name"
          />
          <Button onClick={onAdd}>Add</Button>
        </div>

        <ul className="m-0 p-0 list-none divide-y">
          {players.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2">
              <span className="truncate">{p.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePlayer(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          {players.length} player{players.length !== 1 ? "s" : ""}
        </div>
      </CardFooter>
    </Card>
  );
}
