// app/login/page.tsx (СЕРВЕРНЫЙ)
import LoginForm from '@/components/LoginForm';
import styles from "./page.module.css";
import BackButton from "@/components/BackButton";

export default function LoginPage() {
    return (
        <div className={styles['login-page']}>
            <BackButton href="/" />
            <LoginForm />
        </div>
    )
}   