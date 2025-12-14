export interface Payment {
    id: number;
    amount: number;
    currency: 'RUB' | 'USD' | 'EUR';
    status: 'pending' | 'completed' | 'failed';
}