import { getProtectedData } from "@/services/auth";
import styles from "./page.module.css";
import { redirect } from 'next/navigation';

export default async function MePage() {
    const response = await getProtectedData();
    
    if (!response.ok || response.status !== 200) {
        if (response.status === 401 || response.status === 403) {
            redirect('/login');
        }
        return (
            <div className={styles.container}>
                <div className={styles.welcome_page}>
                    <h1>Ошибка</h1>
                    <p>Не удалось загрузить данные: {response.data.error || 'Unknown error'}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.welcome_page}>
                <h1>Добро пожаловать!</h1>
                <p>Это защищённая страница пользователя.</p>
                <p>Ваш User ID: {response.data.user}</p>
            </div>
        </div>
    );
}