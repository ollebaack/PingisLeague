import { Leaderboard } from "@/components/leaderboard-table";

export default function LeaderboardPage() {
  return (
    <div className="w-full sm:w-xl">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      <Leaderboard />
    </div>
  );
}
