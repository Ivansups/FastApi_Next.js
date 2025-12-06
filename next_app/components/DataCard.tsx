import { GeneratedAnswer } from "@/types/generate_answer";

interface DataCardProps {
    data: GeneratedAnswer;
    index: number;
}

export default function DataCard({ data, index }: DataCardProps) {
    return (
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-glass border border-purple-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-hover hover:border-purple-primary/60 flex-[0_0_calc(33.333%-1rem)] min-w-[280px] max-w-[400px] w-auto group">
            {/* Градиентная полоска сверху при hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-primary via-purple-secondary to-purple-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            
            <div className="mb-4 text-purple-light text-[0.95rem] leading-relaxed last:mb-0">
                <strong className="text-purple-secondary mr-3 font-semibold inline-block min-w-[80px] drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">Ключ:</strong>
                <span className="font-mono text-[0.9rem] text-purple-light bg-purple-primary/10 px-3 py-2 rounded-md border-l-[3px] border-purple-primary shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    {data.keys?.join(', ') || 'N/A'}
                </span>
            </div>
            
            <div className="text-foreground text-[1.1rem] font-semibold leading-relaxed">
                <strong className="text-purple-secondary mr-3 font-semibold inline-block min-w-[80px] drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">Значение:</strong>
                {data.values?.join(', ') || 'N/A'}
            </div>
        </div>
    );
}
