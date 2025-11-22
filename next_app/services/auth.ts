import { User } from "@/types/user";
import Api from "@/lib/api";

export async function auth(credentials:User) {
    const response = await new Api().login(credentials);
        if (response.status === 200) {
            return response;
        }
    throw new Error('Failed to login');
}