import PhoneLoginForm from "./PhoneLoginForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-card shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <PhoneLoginForm />
      </div>
    </div>
  );
}
