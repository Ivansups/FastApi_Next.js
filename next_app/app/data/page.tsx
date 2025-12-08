import styles from "./page.module.css";
import { getData } from "@/services/data";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DataCard from "@/components/DataCard";
import BackButton from "@/components/BackButton";
import { GeneratedAnswer } from "@/types/generate_answer";

interface DataPageProps {
    searchParams: Promise<{ page?: string; limit?: string }>;
}

interface PaginationData {
    page: number;
    totalPages: number;
    total: number;
    hasPrev: boolean;
    hasNext: boolean;
}

async function loadData(page: number, limit: number, token?: string) {
    try {
        const response = await getData(page, limit, token);
        
        if (response.status === 200 && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        if (error instanceof Error && (
            error.message.includes('Токен') || 
            error.message.includes('аутентификации') ||
            error.message.includes('401')
        )) {
            redirect('/login');
        }
        throw error;
    }
}

function DataContent({ 
    data, 
    pagination, 
    page, 
    limit 
}: { 
    data: GeneratedAnswer[]; 
    pagination: PaginationData; 
    page: number; 
    limit: number;
}) {
    return (
        <div className={styles['data-page']} data-theme="light">
            <BackButton href="/me" />
            <div className={styles['data-page__content']}>
                <h1 className={styles['data-page__title']}>Данные</h1>
                
                <div className={styles['data-page__pagination-info']}>
                    <p>
                        Всего элементов: {pagination.total}
                    </p>
                </div>
                
                {/* Навигация по страницам */}
                <div className={styles['data-page__pagination']}>
                    {pagination.hasPrev ? (
                        <Link 
                            href={`/data?page=${page - 1}&limit=${limit}`}
                            className={styles['data-page__pagination-button']}
                        >
                            ← Предыдущая
                        </Link>
                    ) : (
                        <span className={`${styles['data-page__pagination-button']} ${styles['data-page__pagination-button--disabled']}`}>
                            ← Предыдущая
                        </span>
                    )}
                    
                    <span className={styles['data-page__page-info']}>
                        Страница {pagination.page} / {pagination.totalPages}
                    </span>
                    
                    {pagination.hasNext ? (
                        <Link 
                            href={`/data?page=${page + 1}&limit=${limit}`}
                            className={styles['data-page__pagination-button']}
                        >
                            Следующая →
                        </Link>
                    ) : (
                        <span className={`${styles['data-page__pagination-button']} ${styles['data-page__pagination-button--disabled']}`}>
                            Следующая →
                        </span>
                    )}
                </div>
                
                {/* Список данных */}
                <div className={styles['data-page__list']}>
                    {data && data.length > 0 ? (
                        data.map((item: GeneratedAnswer, index: number) => (
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

function ErrorContent({ errorMessage }: { errorMessage: string }) {
    return (
        <div className={styles['data-page']}>
            <BackButton href="/me" />
            <h1>Ошибка</h1>
            <p>{errorMessage}</p>
        </div>
    );
}

export default async function DataPage({ searchParams }: DataPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '10', 10);
    
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    let responseData: { data: GeneratedAnswer[]; pagination: PaginationData } | null = null;
    let errorMessage: string | null = null;
    
    try {
        responseData = await loadData(page, limit, token);
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить данные';
    }
    
    if (errorMessage) {
        return <ErrorContent errorMessage={errorMessage} />;
    }
    
    if (responseData) {
        const { data, pagination } = responseData;
        return <DataContent data={data} pagination={pagination} page={page} limit={limit} />;
    }
    
    return <ErrorContent errorMessage="Не удалось загрузить данные" />;
}