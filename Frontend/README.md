# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Chat API Integration

The backend Express proxy (folder `Backend/`) exposes:

- `POST http://localhost:4000/api/chat` body `{ message: string }` -> `{ answer: string }`

Helper function is in `src/lib/chat.ts`:

```ts
import { sendChatMessage } from './lib/chat';

async function demo() {
  const answer = await sendChatMessage('Hello');
  console.log(answer);
}
```

### Running Both Apps

Open two terminals:

1. Backend

 
```powershell
cd ../Backend
cp .env.example .env
pnpm install
pnpm dev
```

1. Frontend

## Data Fetching (Players & Games)

Local in-memory React state for players/games has been replaced with SWR.

Provider: `src/app/providers/players-provider.tsx` supplies:

- `players` from `GET /api/players`
- `games` from `GET /api/games`
- `getLeaderboard()` returning cached leaderboard from `GET /api/leaderboard`
- Mutations (`addPlayer`, `removePlayer`, `addGame`) perform API calls then mutate SWR caches optimistically and trigger leaderboard revalidation.

`swr` refresh interval for leaderboard matches backend TTL (30s).

If you change backend base URL, update `API_BASE` constant in provider (or move to env injection).
 
```powershell
cd Frontend
pnpm install
pnpm dev
```

Then call `sendChatMessage` (e.g. from a component or the browser console).

### Sample curl

```powershell
curl -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d '{"message":"Ping?"}'
```

### Notes / Next Steps

- Add auth (API key header) before exposing public.
- Consider logging / masking sensitive info.
- Add timeout & retry logic for n8n unavailability.
- SWR integration added: see `src/hooks/useChat.ts` using `useSWRMutation` for sending messages.
