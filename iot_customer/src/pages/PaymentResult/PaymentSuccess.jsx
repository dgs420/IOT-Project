// src/pages/PaymentSuccess.tsx
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const amount = searchParams.get("amount");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <h1 className="text-2xl font-bold text-green-700">✅ Payment Successful!</h1>
            {amount && <p className="mt-2 text-lg">You have added ${amount} to your balance.</p>}
            <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Home</a>
        </div>
    );
}
