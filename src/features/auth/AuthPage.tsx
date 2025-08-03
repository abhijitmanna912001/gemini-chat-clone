import { ModeToggle } from "@/components/mode-toggle";
import PhoneLoginForm from "./PhoneLoginForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <PhoneLoginForm />
    </div>
  );
}
