import styles from "./page.module.css";
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
                <div className={styles['data-page']} data-theme="light">
                    <BackButton href="/me" />
                    <div className={styles['data-page__content']}>
                        <h1 className={styles['data-page__title']}>Данные</h1>
                        
                        {/* Информация о пагинации */}
                        <div className={styles['data-page__pagination-info']}>
                            <p>
                                Страница {pagination.page} из {pagination.totalPages} (Всего элементов: {pagination.total})
                            </p>
                        </div>
                        
                        {/* Навигация по страницам */}
                        <div className={styles['data-page__pagination']}>
                            {pagination.hasPrev && (
                                <Link 
                                    href={`/data?page=${page - 1}&limit=${limit}`}
                                    className={styles['data-page__pagination-button']}
                                >
                                    ← Предыдущая
                                </Link>
                            )}
                            
                            <span className={styles['data-page__page-info']}>
                                Страница {pagination.page} / {pagination.totalPages}
                            </span>
                            
                            {pagination.hasNext && (
                                <Link 
                                    href={`/data?page=${page + 1}&limit=${limit}`}
                                    className={styles['data-page__pagination-button']}
                                >
                                    Следующая →
                                </Link>
                            )}
                        </div>
                        
                        {/* Список данных */}
                        <div className={styles['data-page__list']}>
                            {data && data.length > 0 ? (
                                data.map((item: any, index: number) => (
                                    <DataCard key={index} data={item} index={index} />
                                ))
                            ) : (
                                <p>Нет данных для отображения</p>
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
            <div className={styles['data-page']}>
                <BackButton href="/me" />
                <h1>Ошибка</h1>
                <p>{error instanceof Error ? error.message : 'Не удалось загрузить данные'}</p>
            </div>
        );
    }
    
    return (
        <div className={styles['data-page']}>
            <BackButton href="/me" />
            <h1>Ошибка</h1>
            <p>Не удалось загрузить данные</p>
        </div>
    );
}