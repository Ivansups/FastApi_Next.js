import { getProtectedData } from "@/services/auth";
import { redirect } from 'next/navigation';
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default async function MePage() {
    const response = await getProtectedData();
    
    if (!response.ok || response.status !== 200) {
        if (response.status === 401 || response.status === 403) {
            redirect('/login');
        }
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,sans-serif] p-8 relative">
                <BackButton href="/" />
                <div className="flex flex-col items-center justify-center gap-6 p-12 text-center bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl shadow-glass max-w-[600px]">
                    <h1 className="m-0 text-4xl font-bold bg-gradient-text bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">Ошибка</h1>
                    <p className="m-0 text-[1.1rem] text-purple-light leading-relaxed">Не удалось загрузить данные: {response.data.error || 'Unknown error'}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,sans-serif] p-8 relative">
            <BackButton href="/" />
            <div className="flex flex-col items-center justify-center gap-6 p-12 text-center bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl shadow-glass max-w-[600px]">
                <h1 className="m-0 text-4xl font-bold bg-gradient-text bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">Добро пожаловать!</h1>
                <p className="m-0 text-[1.1rem] text-purple-light leading-relaxed">Это защищённая страница пользователя.</p>
                <p className="m-0 text-[1.1rem] text-purple-light leading-relaxed">Ваш User ID: {response.data.user}</p>
                <Link 
                    href="/data" 
                    className="inline-flex justify-center items-center py-4 px-8 mt-6 rounded-xl border border-purple-primary/30 bg-gradient-button text-background no-underline font-semibold cursor-pointer transition-all duration-300 shadow-purple-glow uppercase tracking-wide relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-purple-glow-hover hover:bg-gradient-to-br hover:from-purple-secondary hover:via-purple-light hover:to-[#ddd6fe]"
                >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <span className="relative z-10">Вы можете перейти на тестовую страницу данных</span>
                </Link>
            </div>
        </div>
    );
}