import { User } from "@/types/user";

export default class Api {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';    async login(credentials:User) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        return {
            status: response.status,
            data: await response.json(),
            ok: response.ok,
        }
    }
}