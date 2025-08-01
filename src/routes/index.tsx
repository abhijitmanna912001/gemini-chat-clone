import AuthPage from "@/features/auth/AuthPage";
import ChatroomPage from "@/features/chatroom/ChatroomPage";
import ChatroomListPage from "@/features/dashboard/ChatroomListPage";
import { useAuthStore } from "@/store/auth";
import { Navigate, Route, Routes } from "react-router";

export default function AppRoutes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/auth"} />}
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <ChatroomListPage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/chat/:chatId"
        element={isLoggedIn ? <ChatroomPage /> : <Navigate to="/auth" />}
      />
    </Routes>
  );
}
