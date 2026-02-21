import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import TournamentDetail from "./pages/TournamentDetail";
import TeamManagement from "./pages/TeamManagement";
import MatchFixtures from "./pages/MatchFixtures";
import ScoreEntry from "./pages/ScoreEntry";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
            <Route path="/tournament/:id/teams" element={<TeamManagement />} />
            <Route path="/tournament/:id/matches" element={<MatchFixtures />} />
            <Route path="/tournament/:id/score/:matchId" element={<ScoreEntry />} />
            <Route path="/tournament/:id/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
