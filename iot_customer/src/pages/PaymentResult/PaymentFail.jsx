// src/pages/PaymentFailed.tsx
import { useSearchParams } from "react-router-dom";

export default function PaymentFail() {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get("reason") || "Unknown error";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100">
            <h1 className="text-2xl font-bold text-red-700">❌ Payment Failed</h1>
            <p className="mt-2 text-lg">Reason: {reason}</p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Try Again</a>
        </div>
    );
}
