import AuthPage from "@/features/auth/AuthPage";
import { useAuthStore } from "@/store/auth";
import { Navigate, Route, Routes } from "react-router";

export default function AppRoutes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* <Route
        path="/dashboard"
        element={isLoggedIn ? <DashboardPage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/chat/:chatId"
        element={isLoggedIn ? <ChatroomPage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/auth"} />}
      /> */}
    </Routes>
  );
}
