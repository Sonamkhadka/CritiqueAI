import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Footer } from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 shadow">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Logos</h1>
              <span className="text-gray-600 hidden md:inline">|</span>
              <span className="text-gray-600 hidden md:inline">Argument Analyzer</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto py-4 flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
