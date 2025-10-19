import GameForm from "@/components/game-form";

export default function GamesPage() {
  return (
    <div className="w-full sm:w-xl">
      <h1 className="text-2xl font-semibold mb-4">Games</h1>
      <GameForm />
    </div>
  );
}
