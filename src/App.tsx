import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/auth";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const login = useAuthStore((s) => s.login);
  const setHydrated = useAuthStore.setState;

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      login(JSON.parse(stored));
    }
    setHydrated({ isHydrated: true });
  }, [login, setHydrated]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
