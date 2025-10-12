import GameForm from "@/components/game-form";
import { Leaderboard } from "@/components/leaderboard-table";
import { PlayersList } from "@/components/players-list";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <PlayersList />
        </div>
        <div>
          <GameForm />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
