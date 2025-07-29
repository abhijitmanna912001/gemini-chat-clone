import { toast, Toaster } from "sonner";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";

function App() {
  const login = useAuthStore((s) => s.login);

  // Restore auth from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      login(parsed);
    }
  }, [login]);

  // Global toast listener for custom events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) toast(detail);
    };

    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
