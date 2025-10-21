import { useContext } from "react";
import { PlayersContext } from "./players-context";

export function usePlayers() {
  const ctx = useContext(PlayersContext);
  if (!ctx) throw new Error("usePlayers must be used within PlayersProvider");
  return ctx;
}
