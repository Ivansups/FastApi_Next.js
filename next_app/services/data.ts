'use server';

import Api from "@/lib/api";

export async function getData(page: number, limit: number, token?: string) {
    const api = new Api();
    const response = await api.getData(page, limit, token);
    
    if (response.status === 200) {
        return {
            status: response.status,
            data: response.data,
            ok: response.ok,
        };
    }
    
    throw new Error(response.data?.detail || response.data?.error || 'Failed to get data');
}