import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import AddMemberPage from "./pages/AddMemberPage";
import ViewMembersPage from "./pages/ViewMembersPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={HomePage} />
      <Route path={"/add-member"} component={AddMemberPage} />
      <Route path={"/members"} component={ViewMembersPage} />
      <Route path={"/member/:id"} component={MemberDetailsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
