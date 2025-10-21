# PingisLeague Backend

Express API powering the PingisLeague frontend. Provides players, games, leaderboard, and chat (proxy to n8n).

## Environment
Copy `.env.example` to `.env` and adjust if needed.

```
N8N_WEBHOOK_URL=http://localhost:5678/workflow/GuJdzzqobMC63qHG
PORT=4000
```

## Development

Install dependencies then run dev server with watch:

```bash
pnpm install
pnpm dev
```

## Base URL

`http://localhost:4000/api`

## Health

`GET /health` -> `{ status: "ok" }`

## Players

`GET /players` -> `{ players: Player[] }`

`POST /players` body: `{ name: string }` -> `{ player: Player }`

`DELETE /players/:id` -> `{ ok: true }` (404 if not found)

Player: `{ id: string; name: string }`

## Games

`GET /games` -> `{ games: Game[] }`

`POST /games` body: `{ playerAId, playerBId, scoreA, scoreB }` -> `{ game: Game }`

Validations:

- `playerAId` and `playerBId` must exist and be different
- `scoreA` / `scoreB` numbers
- No draws (`scoreA !== scoreB`)

Game: `{ id: string; playerAId: string; playerBId: string; scoreA: number; scoreB: number; date: string }`

## Leaderboard

`GET /leaderboard` -> `{ leaderboard: LeaderboardEntry[], cached: boolean, ttlMs: number }`

LeaderboardEntry:

```ts
{
  player: Player,
  wins: number,
  losses: number,
  matches: number,
  pointsFor: number,
  pointsAgainst: number,
  pointDiff: number
}
```

Caching: Leaderboard cached for 30s; invalidated on player/game mutations.

## Chat

`POST /chat` body: `{ message: string }` -> `{ answer: string }` (forwarded to n8n workflow response).

## Data & Caching

The backend keeps an in-memory `store` (see `src/store.js`) with two arrays: `players` and `games`. A cached leaderboard is derived from these with a 30s TTL to avoid recomputing on every request. Any mutation (adding/removing players or adding games) invalidates the leaderboard cache.

### Endpoints

- `GET /api/players` – Returns `{ players: Player[] }`
- `POST /api/players` – Body: `{ name: string }` -> `{ player: Player }`
- `DELETE /api/players/:id` – Returns `{ ok: true }`
- `GET /api/games` – Returns `{ games: Game[] }`
- `POST /api/games` – Body: `{ playerAId, playerBId, scoreA, scoreB }` -> `{ game: Game }`
- `GET /api/leaderboard` – Returns `{ leaderboard: LeaderboardEntry[], cached: boolean, ttlMs: number }`

These are intentionally simple and thin so they can be swapped for a persistent store later.

## Example curl

```bash
curl -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
curl http://localhost:4000/api/players
curl http://localhost:4000/api/leaderboard
```

## Notes / Roadmap

- CORS allows `http://localhost:5173` (Vite default)
- Replace in-memory with SQLite/Postgres
- Add input validation (zod) + better error shapes
- Pagination for games endpoint
- Rate limiting for chat
- Authentication for mutations (players/games)
