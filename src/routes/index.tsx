import AuthPage from "@/features/auth/AuthPage";
import { Navigate, Route, Routes } from "react-router";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/chat/:chatId" element={<ChatroomPage />} /> */}
    </Routes>
  );
}
