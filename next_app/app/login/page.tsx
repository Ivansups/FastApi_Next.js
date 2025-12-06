// app/login/page.tsx (СЕРВЕРНЫЙ)
import LoginForm from '@/components/LoginForm';
import BackButton from "@/components/BackButton";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,sans-serif] relative overflow-hidden p-8">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] animate-[pulse_8s_ease-in-out_infinite]" />
            <BackButton href="/" />
            <LoginForm />
        </div>
    )
}   