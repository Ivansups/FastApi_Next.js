import { getData } from "@/services/data";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DataCard from "@/components/DataCard";
import BackButton from "@/components/BackButton";

interface DataPageProps {
    searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DataPage({ searchParams }: DataPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '10', 10);
    
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    try {
        const response = await getData(page, limit, token);
        
        if (response.status === 200 && response.data) {
            const { data, pagination } = response.data;
            
            return (
                <div className="flex flex-col min-h-screen py-12 px-8 max-w-5xl mx-auto bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-foreground relative items-center justify-start" data-theme="light">
                    <BackButton href="/me" />
                    <div className="flex flex-col items-center w-full max-w-full mb-8">
                        <h1 className="text-center mx-auto mb-10 text-4xl font-bold tracking-tight bg-gradient-text bg-clip-text text-transparent w-full drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                            Данные
                        </h1>
                        
                        <div className="text-center mx-auto mb-8 text-purple-light text-base px-6 py-3 bg-white/5 border border-purple-primary/30 rounded-xl backdrop-blur-glass shadow-glass block w-fit font-medium">
                            <p className="text-purple-light m-0">
                                Страница {pagination.page} из {pagination.totalPages} (Всего элементов: {pagination.total})
                            </p>
                        </div>
                        
                        {/* Навигация по страницам */}
                        <div className="flex justify-center items-center gap-6 mx-auto mb-12 px-6 py-6 bg-white/5 border border-purple-primary/30 rounded-2xl backdrop-blur-glass shadow-glass flex-wrap w-fit">
                            {pagination.hasPrev && (
                                <Link 
                                    href={`/data?page=${page - 1}&limit=${limit}`}
                                    className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl border border-purple-primary/30 bg-gradient-button text-background no-underline font-semibold text-[0.95rem] transition-all duration-300 shadow-purple-glow relative overflow-hidden uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-purple-glow-hover hover:bg-gradient-to-br hover:from-purple-secondary hover:via-purple-light hover:to-[#ddd6fe] hover:border-purple-primary/60"
                                >
                                    ← Предыдущая
                                </Link>
                            )}
                            
                            <span className="py-3.5 px-6 text-purple-light font-semibold text-[0.95rem] bg-purple-primary/10 rounded-[10px] border border-purple-primary/30">
                                Страница {pagination.page} / {pagination.totalPages}
                            </span>
                            
                            {pagination.hasNext && (
                                <Link 
                                    href={`/data?page=${page + 1}&limit=${limit}`}
                                    className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl border border-purple-primary/30 bg-gradient-button text-background no-underline font-semibold text-[0.95rem] transition-all duration-300 shadow-purple-glow relative overflow-hidden uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-purple-glow-hover hover:bg-gradient-to-br hover:from-purple-secondary hover:via-purple-light hover:to-[#ddd6fe] hover:border-purple-primary/60"
                                >
                                    Следующая →
                                </Link>
                            )}
                        </div>
                        
                        {/* Список данных */}
                        <div className="flex flex-row flex-wrap gap-6 mx-auto mt-4 w-full justify-center">
                            {data && data.length > 0 ? (
                                data.map((item: any, index: number) => (
                                    <DataCard key={index} data={item} index={index} />
                                ))
                            ) : (
                                <p className="text-foreground">Нет данных для отображения</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    } catch (error) {
        if (error instanceof Error && (
            error.message.includes('Токен') || 
            error.message.includes('аутентификации') ||
            error.message.includes('401')
        )) {
            redirect('/login');
        }
        
        return (
            <div className="flex flex-col min-h-screen py-12 px-8 max-w-5xl mx-auto bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-foreground relative items-center justify-start">
                <BackButton href="/me" />
                <h1 className="text-4xl font-bold text-foreground">Ошибка</h1>
                <p className="text-foreground">{error instanceof Error ? error.message : 'Не удалось загрузить данные'}</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen py-12 px-8 max-w-5xl mx-auto bg-gradient-purple bg-fixed font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-foreground relative items-center justify-start">
            <BackButton href="/me" />
            <h1 className="text-4xl font-bold text-foreground">Ошибка</h1>
            <p className="text-foreground">Не удалось загрузить данные</p>
        </div>
    );
}