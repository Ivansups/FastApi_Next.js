'use client';

import { useState } from 'react';
import { auth } from "@/services/auth";
import styles from "@/app/login/page.module.css";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        
        const formData = new FormData(e.target as HTMLFormElement);
        const credentials = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        }
        
        try {
            const response = await auth(credentials);
            if (response.status === 200) {
                setMessage({ type: 'success', text: response.data.message || 'Login successful' });
                router.replace('/me');
            } else if (response.status === 401) {
                setMessage({ type: 'error', text: 'Invalid credentials' });
            } else {
                setMessage({ type: 'error', text: 'Internal server error' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {message && (
                <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    className={styles.input}
                    disabled={loading}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className={styles.input}
                    disabled={loading}
                />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </>
    )
}