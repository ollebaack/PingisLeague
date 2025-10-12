import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Player = { id: string; name: string };
export type Game = {
  id: string;
  playerAId: string;
  playerBId: string;
  scoreA: number;
  scoreB: number;
  date: string;
};

type LeaderboardEntry = {
  player: Player;
  wins: number;
  losses: number;
  matches: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
};

type State = {
  players: Player[];
  games: Game[];
  addPlayer: (name: string) => Player;
  removePlayer: (id: string) => void;
  addGame: (game: Omit<Game, "id" | "date">) => Game;
  getLeaderboard: () => LeaderboardEntry[];
};

const STORAGE_PLAYERS = "tt_players_v1";
const STORAGE_GAMES = "tt_games_v1";

const PlayersContext = createContext<State | undefined>(undefined);

function uid(prefix = "") {
  return (
    prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function PlayersProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PLAYERS);
      return raw ? (JSON.parse(raw) as Player[]) : [];
    } catch {
      return [];
    }
  });

  const [games, setGames] = useState<Game[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_GAMES);
      return raw ? (JSON.parse(raw) as Game[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYERS, JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAMES, JSON.stringify(games));
    } catch {
      // ignore
    }
  }, [games]);

  const addPlayer = (name: string) => {
    const p: Player = { id: uid("p_"), name: name.trim() || "Player" };
    setPlayers((s) => [...s, p]);
    return p;
  };

  const removePlayer = (id: string) => {
    setPlayers((s) => s.filter((p) => p.id !== id));
    setGames((g) =>
      g.filter((gg) => gg.playerAId !== id && gg.playerBId !== id)
    );
  };

  const addGame = (partial: Omit<Game, "id" | "date">) => {
    const g: Game = {
      ...partial,
      id: uid("g_"),
      date: new Date().toISOString(),
    };
    setGames((s) => [g, ...s]);
    return g;
  };

  const getLeaderboard = useMemo(() => {
    return () => {
      const map = new Map<string, LeaderboardEntry>();
      players.forEach((p) =>
        map.set(p.id, {
          player: p,
          wins: 0,
          losses: 0,
          matches: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          pointDiff: 0,
        })
      );

      for (const g of games) {
        const a = map.get(g.playerAId);
        const b = map.get(g.playerBId);
        if (!a || !b) continue;
        a.matches++;
        b.matches++;
        a.pointsFor += g.scoreA;
        a.pointsAgainst += g.scoreB;
        b.pointsFor += g.scoreB;
        b.pointsAgainst += g.scoreA;
        if (g.scoreA > g.scoreB) {
          a.wins++;
          b.losses++;
        } else if (g.scoreB > g.scoreA) {
          b.wins++;
          a.losses++;
        }
      }
      const arr = Array.from(map.values()).map((e) => ({
        ...e,
        pointDiff: e.pointsFor - e.pointsAgainst,
      }));
      arr.sort((x, y) => {
        if (y.wins !== x.wins) return y.wins - x.wins;
        if (y.pointDiff !== x.pointDiff) return y.pointDiff - x.pointDiff;
        return y.pointsFor - x.pointsFor;
      });
      return arr;
    };
  }, [players, games]);

  const value: State = {
    players,
    games,
    addPlayer,
    removePlayer,
    addGame,
    getLeaderboard,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
}

export function usePlayers() {
  const ctx = useContext(PlayersContext);
  if (!ctx) throw new Error("usePlayers must be used within PlayersProvider");
  return ctx;
}
