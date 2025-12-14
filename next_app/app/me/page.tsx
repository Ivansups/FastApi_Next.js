import { getProtectedData } from "@/services/auth";
import styles from "./page.module.css";
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
            <div className={styles['me-page']}>
                <BackButton href="/" />
                <div className={styles['me-page__welcome']}>
                    <h1>Ошибка</h1>
                    <p>Не удалось загрузить данные: {response.data.error || 'Unknown error'}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles['me-page']}>
            <BackButton href="/" />
            <div className={styles['me-page__welcome']}>
                <h1>Добро пожаловать!</h1>
                <p>Это защищённая страница пользователя.</p>
                <p>Ваш User ID: {response.data.user}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <Link className={styles['me-page__link']} href="/data">
                        Страница данных
                    </Link>
                    <Link className={styles['me-page__link']} href="/dashboard">
                        Дашборд с графиками
                    </Link>
                    <Link className={styles['me-page__link']} href="/chat">
                        Чат (WebSocket)
                    </Link>
                    <Link className={styles['me-page__link']} href="/payment">
                        Оплата
                    </Link>
                </div>
            </div>
        </div>
    );
}