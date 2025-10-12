import { ContactForm } from "@/components/contact-form";
import { GameForm } from "@/components/game-form";
import { Leaderboard } from "@/components/leaderboard-table";
import { PlayersList } from "@/components/players-list";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <PlayersList />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <GameForm />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <Leaderboard />
        </div>
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <ContactForm />
      </div>
    </div>
  );
}
