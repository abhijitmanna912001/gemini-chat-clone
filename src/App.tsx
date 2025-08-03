import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/auth";

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
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
