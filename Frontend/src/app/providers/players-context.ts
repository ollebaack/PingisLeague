import { createContext, useContext } from "react";

export type Player = { id: string; name: string };
export type Game = {
  id: string;
  playerAId: string;
  playerBId: string;
  scoreA: number;
  scoreB: number;
  date: string;
};
export type LeaderboardEntry = {
  player: Player;
  wins: number;
  losses: number;
  matches: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
};
export type State = {
  players: Player[];
  games: Game[];
  addPlayer: (name: string) => Promise<Player>;
  removePlayer: (id: string) => Promise<void>;
  addGame: (game: Omit<Game, "id" | "date">) => Promise<Game>;
  getLeaderboard: () => LeaderboardEntry[];
  loading: boolean;
  error: string | null;
};

export const PlayersContext = createContext<State | undefined>(undefined);

export function usePlayers() {
  const ctx = useContext(PlayersContext);
  if (!ctx) throw new Error("usePlayers must be used within PlayersProvider");
  return ctx;
}
