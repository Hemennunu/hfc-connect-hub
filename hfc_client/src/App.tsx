import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Team from "./pages/Team";
import PriorityAreas from "./pages/PriorityAreas";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Alumni from "./pages/Alumni";
import News from "./pages/News";
import Reports from "./pages/Reports";
import CaseStories from "./pages/CaseStories";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/priority-areas" element={<PriorityAreas />} />
          <Route path="/thematic-areas" element={<PriorityAreas />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/news" element={<News />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/case-stories" element={<CaseStories />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
