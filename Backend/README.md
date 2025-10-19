# PingisLeague Backend

Simple Express proxy API to call an n8n workflow.

## Environment
Copy `.env.example` to `.env` and adjust if needed.

```
N8N_WORKFLOW_URL=http://localhost:5678/workflow/GuJdzzqobMC63qHG
PORT=4000
```

## Routes
- `GET /api/health` -> `{ status: 'ok' }`
- `POST /api/chat` -> body `{ message: string }` returns `{ answer: string | any }` from n8n
- `GET /api/players` -> `{ players: Player[] }` mock list

## Development

Install dependencies then run dev server with watch:

```bash
pnpm install
pnpm dev
```

## Example curl

```bash
curl -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
curl http://localhost:4000/api/players
```

 
## Notes

- CORS currently allows `http://localhost:5173` (Vite default).
- Add authentication (API key or token) before exposing externally.
