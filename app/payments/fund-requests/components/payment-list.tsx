import apiClient from "@/lib/axios";
import { useEffect, useState } from "react";

export default function PaymentsList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await apiClient.get("api/payments/grain-purchases");

        setPayments(res.data);
        console.log("Fetched payments:", res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Grain Purchase Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment.id} className="flex justify-between py-2">
              <span>{payment.reference}</span>
              <span>{payment.amount}</span>
              <span>{payment.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
