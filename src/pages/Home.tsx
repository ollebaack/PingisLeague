import { ContactForm } from "@/components/contact-form";
import { GameForm } from "@/components/game-form";
import { Leaderboard } from "@/components/leaderboard";
import { PlayersList } from "@/components/players-list";

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <PlayersList />
          <div className="h-4" />
          <GameForm />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
