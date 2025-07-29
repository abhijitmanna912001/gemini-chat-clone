import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";

function App() {
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      login(parsed);
    }
  }, [login]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
