import Api from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getProtectedData() {
    // Получаем куки на сервере
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    
    // Создаем API с передачей токена
    const api = new Api();
    const response = await api.getProtectedData();
    
    if (response.status === 200) {
        return response;
    }
    throw new Error('Failed to get protected data');
}