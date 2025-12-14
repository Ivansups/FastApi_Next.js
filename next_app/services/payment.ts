export async function createPayment(amount: number, currency: 'RUB' | 'USD' | 'EUR', reqId: string) {
    const response = await fetch(`/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: {
                value: amount,
                currency: currency,
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            },
            description: 'Payment for services',
            metadata: {
                internalPaymentId: reqId,
            }
        }),
    });
    
    if (response.ok) {
        return response.json();
    }

    throw new Error(response.statusText);
}