import { User } from "@/types/user";

export default class Api {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    async login(credentials:User) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            credentials: 'include', // чтобы куки отправлялись
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        console.log('response', response);
        return {
            status: response.status,
            data: await response.json(),
            ok: response.ok,
        }
    }

    async getProtectedData(token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Cookie'] = `access_token=${token}`;
        }
        
        const response = await fetch(`${this.baseUrl}/protected`, {
            headers: headers,
        })        
        let data;
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (isJson) {
            try {
                data = await response.json();
            } catch (error) {
                const text = await response.text();
                data = { error: text || 'Invalid JSON response' };
            }
        } else {
            const text = await response.text();
            data = { error: text || 'Unknown error' };
        }
        
        return {
            status: response.status,
            data: data,
            ok: response.ok,
        }
    }

    async getData(page: number = 1, limit: number = 10, token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Cookie'] = `access_token=${token}`;
        }
        
        const url = new URL(`${this.baseUrl}/data`);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', limit.toString());
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            credentials: 'include',
            headers: headers,
        });
        
        let data;
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (isJson) {
            try {
                data = await response.json();
            } catch (error) {
                const text = await response.text();
                data = { 
                    error: text || 'Invalid JSON response',
                    detail: text || 'Invalid JSON response'
                };
            }
        } else {
            const text = await response.text();
            data = { 
                error: text || 'Unknown error',
                detail: text || 'Unknown error'
            };
        }
        
        return {
            status: response.status,
            data: data,
                ok: response.ok,
            }
    }
}