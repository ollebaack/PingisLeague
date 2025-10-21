// Central in-memory store and helper functions.
// This keeps application state cohesive and makes future replacement with a DB easier.
import { players as seedPlayers } from "./data/players.js";

// --- State ---
export const store = {
  players: [...seedPlayers], // { id, name }
  games: [], // { id, playerAId, playerBId, scoreA, scoreB, date }
};

// --- ID generation ---
export function uid(prefix = "") {
  return (
    prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

// --- Leaderboard ---
function computeLeaderboard(players, games) {
  const map = new Map();
  for (const p of players) {
    map.set(p.id, {
      player: p,
      wins: 0,
      losses: 0,
      matches: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
    });
  }
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
}

// --- Cache (leaderboard) ---
let leaderboardCache = { value: null, ts: 0 };
const LEADERBOARD_TTL_MS = 30_000; // 30s

export function getLeaderboardCached() {
  const now = Date.now();
  if (
    leaderboardCache.value &&
    now - leaderboardCache.ts < LEADERBOARD_TTL_MS
  ) {
    return leaderboardCache.value;
  }
  const value = computeLeaderboard(store.players, store.games);
  leaderboardCache = { value, ts: now };
  return value;
}
export function invalidateLeaderboard() {
  leaderboardCache = { value: null, ts: 0 };
}
export { LEADERBOARD_TTL_MS };

// --- Player operations ---
export function addPlayer(name) {
  const player = { id: uid("p_"), name: name.trim() };
  store.players.push(player);
  invalidateLeaderboard();
  return player;
}
export function removePlayer(id) {
  const idx = store.players.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.players.splice(idx, 1);
  for (let i = store.games.length - 1; i >= 0; i--) {
    const g = store.games[i];
    if (g.playerAId === id || g.playerBId === id) store.games.splice(i, 1);
  }
  invalidateLeaderboard();
  return true;
}

// --- Game operations ---
export function addGame({ playerAId, playerBId, scoreA, scoreB }) {
  const game = {
    id: uid("g_"),
    playerAId,
    playerBId,
    scoreA,
    scoreB,
    date: new Date().toISOString(),
  };
  store.games.unshift(game);
  invalidateLeaderboard();
  return game;
}
