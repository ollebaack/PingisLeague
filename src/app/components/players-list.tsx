import { useState, type ChangeEvent } from "react";
import { usePlayers } from "../state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function PlayersList() {
  const { players, addPlayer, removePlayer } = usePlayers();
  const [name, setName] = useState("");

  return (
    <Card>
      <h3>Players</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Input
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="New player name"
        />
        <Button
          onClick={() => {
            addPlayer(name);
            setName("");
          }}
        >
          Add
        </Button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {players.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 0",
            }}
          >
            <span>{p.name}</span>
            <Button variant="ghost" onClick={() => removePlayer(p.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
