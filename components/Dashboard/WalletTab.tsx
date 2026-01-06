"use client";

import { useState, useEffect } from "react";

interface WalletTabProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export default function WalletTab({ walletBalance, setWalletBalance }: WalletTabProps) {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const [storedPhone, setStoredPhone] = useState("");

  // Load phone from localStorage
  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setStoredPhone(phone);
  }, []);

  const handleProceed = async () => {
    if (!amount || Number(amount) < 1) {
      setAmountError("Minimum amount is ₹1");
      return;
    }

    if (!method) return alert("Please select a payment method");

    if (!storedPhone) {
      alert("Phone number not found. Please log in again.");
      return;
    }

    setLoading(true);
const userId = localStorage.getItem("userId");

    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        mobile: storedPhone,
        userId
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    // Save order ID
    localStorage.setItem("pending_order", data.orderId);

    // Redirect to real payment page
    window.location.href = data.paymentUrl;
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Wallet Balance</h2>

      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm mb-6">
        <p className="text-lg font-bold">Current Balance: ₹{walletBalance}</p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] shadow-lg">
        <div className="space-y-4">

          {/* Amount Input */}
          <div>
            <label className="font-semibold text-sm">Enter Amount</label>
            <input
              type="number"
              value={amount}
              placeholder="Minimum ₹1"
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError("");
              }}
              className="w-full p-3 mt-1 rounded-xl border bg-[var(--card)] border-[var(--border)]"
            />
            {amountError && <p className="text-red-500 text-sm">{amountError}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-semibold text-sm">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3 mt-2">

              <button
                onClick={() => setMethod("upi")}
                className={`p-3 rounded-xl border transition ${
                  method === "upi"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:bg-[var(--card)]"
                }`}
              >
                UPI
              </button>

              <button
                onClick={() => setMethod("usdt")}
                disabled
                className={`p-3 rounded-xl border transition ${
                  method === "usdt"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:bg-[var(--card)]"
                }`}
              >
                USDT (TRC20)
              </button>

            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            // disabled={loading}
                        disabled={true}

            className="w-full p-3 mt-2 bg-[var(--accent)] text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>

        </div>
      </div>
    </>
  );
}
