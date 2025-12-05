import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
    return (
        <div className={styles['home-page']}>
            <div className={styles['home-page__hero']}>
                <h1 className={styles['home-page__title']}>Вход в систему</h1>
                <p className={styles['home-page__subtitle']}>
                    Современная платформа с футуристическим дизайном
                </p>
                <div className={styles['home-page__ctas']}>
                    <Link href="/login" className="btn-primary">
                        Войти в систему
                    </Link>
                </div>
            </div>
        </div>
    );
}