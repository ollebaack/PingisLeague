import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import PlayersPage from "@/pages/Players";
import GamesPage from "@/pages/Games";
import LeaderboardPage from "@/pages/Leaderboard";
import ContactPage from "@/pages/Contact";
import SettingsPage from "@/pages/Settings";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
