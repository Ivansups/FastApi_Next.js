'use server';

import { User } from "@/types/user";
import Api from "@/lib/api";
import { cookies } from 'next/headers';

export async function auth(credentials:User) {
    const response = await new Api().login(credentials);
    if (response.status === 200) {
        return response;
    }
    throw new Error('Failed to login');
}

export async function getProtectedData() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    
    const api = new Api();
    const response = await api.getProtectedData(token?.value);
    
    if (response.status === 200) {
        return response;
    }
    throw new Error('Failed to get protected data');
}

export async function getGeneratedAnswer() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    
    const api = new Api();
    const response = await api.getGeneratedAnswer(token?.value);
    
    if (response.status === 200) {
        return response;
    }
    throw new Error('Failed to get generated answer');
}