import { useState } from "react";
import Layout from "@/app/layout";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { PlayersProvider } from "@/app/state";
import { PlayersList } from "@/app/components/players-list";
import { GameForm } from "@/app/components/game-form";
import { Leaderboard } from "@/app/components/leaderboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <PlayersProvider>
      <Layout>
        <h1>Vite + React</h1>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 24,
          }}
        >
          <div>
            <PlayersList />
            <div style={{ height: 16 }} />
            <GameForm />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>

        <div className="mt-8">
          <ContactForm />
        </div>
      </Layout>
    </PlayersProvider>
  );
}

export default App;
