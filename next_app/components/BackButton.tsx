import Link from "next/link";

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = "← Назад" }: BackButtonProps) {
    return (
        <Link 
            href={href} 
            className="inline-flex items-center justify-center py-3 px-6 rounded-xl border border-purple-primary/30 bg-white/5 backdrop-blur-[10px] text-purple-light no-underline font-semibold text-[0.95rem] transition-all duration-300 shadow-[0_4px_15px_rgba(139,92,246,0.2),0_0_10px_rgba(139,92,246,0.1)] fixed top-6 left-6 z-[1000] overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4),0_0_20px_rgba(139,92,246,0.2)] hover:border-purple-primary/60 hover:bg-purple-primary/10 hover:text-foreground active:translate-y-0"
        >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            <span className="relative z-10">{label}</span>
        </Link>
    );
}

