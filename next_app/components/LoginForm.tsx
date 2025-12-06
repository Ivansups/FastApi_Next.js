'use client';

import { useState } from 'react';
import { auth } from "@/services/auth";
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
        <div className="relative z-10">
            {message && (
                <div className={`py-4 px-6 rounded-xl text-center backdrop-blur-[10px] border font-medium mb-6 ${
                    message.type === 'success' 
                        ? 'bg-[rgba(16,185,129,0.2)] text-[#6ee7b7] border-[rgba(16,185,129,0.3)] shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                        : 'bg-[rgba(239,68,68,0.2)] text-[#fca5a5] border-[rgba(239,68,68,0.3)] shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                }`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-12 bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl shadow-glass min-w-[380px] relative z-10">
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    className="py-4 px-5 border border-purple-primary/30 rounded-xl text-base bg-white/5 text-foreground transition-all duration-300 backdrop-blur-[10px] placeholder:text-foreground/50 focus:outline-none focus:border-purple-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2),0_0_20px_rgba(139,92,246,0.3)] focus:bg-white/[0.08] focus:-translate-y-0.5 disabled:opacity-50"
                    disabled={loading}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="py-4 px-5 border border-purple-primary/30 rounded-xl text-base bg-white/5 text-foreground transition-all duration-300 backdrop-blur-[10px] placeholder:text-foreground/50 focus:outline-none focus:border-purple-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2),0_0_20px_rgba(139,92,246,0.3)] focus:bg-white/[0.08] focus:-translate-y-0.5 disabled:opacity-50"
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className="py-4 px-8 bg-gradient-button text-background border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-purple-glow uppercase tracking-wide group hover:-translate-y-0.5 hover:shadow-purple-glow-hover hover:bg-gradient-to-br hover:from-purple-secondary hover:via-purple-light hover:to-[#ddd6fe] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={loading}
                >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <span className="relative z-10">{loading ? 'Loading...' : 'Login'}</span>
                </button>
            </form>
        </div>
    )
}