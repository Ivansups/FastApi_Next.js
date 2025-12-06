import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-8 relative">
            <div className="flex flex-col items-center justify-center text-center gap-8 max-w-[800px] py-16 px-12 bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl shadow-glass md:py-12 md:px-8">
                <h1 className="text-[3.5rem] font-bold tracking-[-0.03em] m-0 bg-gradient-text bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(139,92,246,0.5)] leading-tight md:text-4xl">
                    Добро пожаловать
                </h1>
                <p className="text-xl text-purple-light leading-relaxed m-0 max-w-[600px] md:text-lg">
                    Современная платформа с футуристическим дизайном
                </p>
                <div className="flex gap-4 mt-4 flex-wrap justify-center">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center justify-center py-4 px-8 rounded-xl border border-purple-primary/30 bg-gradient-button text-background no-underline font-semibold text-base cursor-pointer transition-all duration-300 shadow-purple-glow uppercase tracking-wide relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-purple-glow-hover hover:bg-gradient-to-br hover:from-purple-secondary hover:via-purple-light hover:to-[#ddd6fe]"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <span className="relative z-10">Войти в систему</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}