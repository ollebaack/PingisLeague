import { PlayersList } from "@/components/players-list";

export default function PlayersPage() {
  return (
    <div className="w-xl">
      <h1 className="text-2xl font-semibold mb-4">Players</h1>
      <PlayersList />
    </div>
  );
}
