import React, { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { PlayersContext } from "./players-context";
import type { State, Player, Game, LeaderboardEntry } from "./players-context";

const API_BASE = "http://localhost:4000/api"; // TODO: inject via env

type PlayersResponse = { players: Player[] };
type GamesResponse = { games: Game[] };
type LeaderboardResponse = { leaderboard: LeaderboardEntry[] };

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export function PlayersProvider({ children }: { children: React.ReactNode }) {
  const {
    data: playersData,
    error: playersError,
    isLoading: playersLoading,
  } = useSWR<PlayersResponse>(`${API_BASE}/players`, fetcher, {
    suspense: false,
  });
  const {
    data: gamesData,
    error: gamesError,
    isLoading: gamesLoading,
  } = useSWR<GamesResponse>(`${API_BASE}/games`, fetcher, {
    suspense: false,
  });
  const { data: leaderboardData } = useSWR<LeaderboardResponse>(
    `${API_BASE}/leaderboard`,
    fetcher,
    { refreshInterval: 30_000 } // align with backend TTL
  );

  const players = playersData?.players ?? [];
  const games = gamesData?.games ?? [];

  const addPlayer = useCallback(async (name: string) => {
    const trimmed = name.trim() || "Player";
    const res = await fetch(`${API_BASE}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    if (!res.ok) throw new Error("Failed to add player");
    const data = await res.json();
    // Update SWR cache
    mutate(
      `${API_BASE}/players`,
      (current?: PlayersResponse) => {
        const list = current?.players ?? [];
        return { players: [...list, data.player] };
      },
      false
    );
    // Also revalidate leaderboard
    mutate(`${API_BASE}/leaderboard`);
    return data.player as Player;
  }, []);

  const removePlayer = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/players/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 404)
      throw new Error("Failed to remove player");
    mutate(
      `${API_BASE}/players`,
      (current?: PlayersResponse) => {
        const list = current?.players ?? [];
        return { players: list.filter((p) => p.id !== id) };
      },
      false
    );
    mutate(
      `${API_BASE}/games`,
      (current?: GamesResponse) => {
        const list = current?.games ?? [];
        return {
          games: list.filter((g) => g.playerAId !== id && g.playerBId !== id),
        };
      },
      false
    );
    mutate(`${API_BASE}/leaderboard`);
  }, []);

  const addGame = useCallback(async (partial: Omit<Game, "id" | "date">) => {
    const res = await fetch(`${API_BASE}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error("Failed to add game");
    const data = await res.json();
    mutate(
      `${API_BASE}/games`,
      (current?: GamesResponse) => {
        const list = current?.games ?? [];
        return { games: [data.game, ...list] };
      },
      false
    );
    mutate(`${API_BASE}/leaderboard`);
    return data.game as Game;
  }, []);

  const getLeaderboard = () => leaderboardData?.leaderboard ?? [];

  const loading = playersLoading || gamesLoading;
  const error = playersError?.message || gamesError?.message || null;

  const value: State = {
    players,
    games,
    addPlayer,
    removePlayer,
    addGame,
    getLeaderboard,
    loading,
    error,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
}

// Hook logic in separate file for fast-refresh integrity.
