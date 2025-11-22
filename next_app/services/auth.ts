import { User } from "@/types/user";
import Api from "@/lib/api";

export async function auth(credentials:User) {
    const response = await new Api().login(credentials);
        if (response.status === 200) {
            return response;
        }
    throw new Error('Failed to login');
}

export async function getGeneratedAnswer() {
    const response = await new Api().getGeneratedAnswer();
    if (response.status === 200) {
        return response;
    }
    throw new Error('Failed to get generated answer');
}