"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export default function ReviewAndPaymentStep({
  step,
  setStep,
  itemName,
  itemImage,
  price,
  discount,
  totalPrice,
  userEmail,
  userPhone,
  reviewData,
  walletBalance,
  paymentMethod,
  setPaymentMethod,
  onPaymentComplete,
  slug,
  itemSlug,
}) {
  const [upiQR, setUpiQR] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  /* ================= UPI QR ================= */
  const handleUPI = async () => {
    setPaymentMethod("upi");

    const upiId = "yourupi@bank";
    const upiString = `upi://pay?pa=${upiId}&pn=YourStore&am=${totalPrice}&cu=INR`;

    const qr = await QRCode.toDataURL(upiString);
    setUpiQR(qr);
  };

  /* ================= PROCEED ================= */
  const handleProceed = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsRedirecting(true);

    try {
      const userId = sessionStorage.getItem("userId");
      const storedPhone = userPhone || sessionStorage.getItem("phone");

      if (!storedPhone) {
        alert("Phone number missing. Please log in again.");
        setIsRedirecting(false);
        return;
      }

      const orderPayload = {
        gameSlug: slug,
        itemSlug,
        itemName,
        playerId: reviewData.playerId, // ✅ Character ID
        paymentMethod,
        price: totalPrice,
        email: userEmail || null,
        phone: storedPhone,
        userId: userId || null,
        currency: "INR",
        zoneId: "N/A", // BGMI has no zone
      };
const token = sessionStorage.getItem("token");

      const res = await fetch("/api/order/create-gateway-order", {
        method: "POST",
   headers: {
        Authorization: `Bearer ${token}`,
      },        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Order failed: " + data.message);
        setIsRedirecting(false);
        return;
      }

      sessionStorage.setItem("pending_topup_order", data.orderId);

      window.location.href = data.paymentUrl;
    } catch {
      alert("Something went wrong. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          {/* PAYMENT METHOD */}
          <div className="rounded-2xl border border-gray-700 bg-black/30 p-5">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

            <div className="space-y-3">
              {/* Wallet (disabled) */}
              <button
                disabled
                className="w-full p-4 rounded-xl border border-gray-700 opacity-50 cursor-not-allowed flex justify-between"
              >
                <span className="font-medium">Wallet</span>
                <span className="text-sm">₹{walletBalance}</span>
              </button>

              {/* UPI */}
              <button
                onClick={handleUPI}
                className={`w-full p-4 rounded-xl border transition-all flex justify-between
                  ${
                    paymentMethod === "upi"
                      ? "border-[var(--accent)] bg-[var(--accent)]/15"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
              >
                <span className="font-medium">UPI / QR Payment</span>
                <span className="text-xs text-gray-400">Instant</span>
              </button>
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="border border-gray-700/60 rounded-xl bg-black/20 px-4 py-3">
            <h3 className="text-sm font-semibold mb-2">Your Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span>{userEmail || "Not provided"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span>{userPhone || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* GAME ACCOUNT (BGMI) */}
          <div className="border border-gray-700/60 rounded-xl bg-black/20 px-4 py-3">
            <h3 className="text-sm font-semibold mb-2">Game Account</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Username</span>
                <span>{reviewData.userName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Character ID</span>
                <span>{reviewData.playerId}</span>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="rounded-2xl border border-gray-700 bg-black/30 p-5">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={handleProceed}
              disabled={isRedirecting || !paymentMethod}
              className="mt-5 w-full rounded-xl bg-[var(--accent)] text-black py-3 font-semibold
                disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isRedirecting ? "Redirecting…" : "Proceed to Pay"}
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 3 (UPI) ================= */}
      {step === 3 && paymentMethod === "upi" && (
        <div className="rounded-2xl border border-gray-700 bg-black/30 p-6 text-center">
          <p className="font-semibold mb-3">Scan & Pay via UPI</p>

          <div className="w-52 h-52 mx-auto bg-white p-4 rounded-2xl">
            {upiQR && <Image src={upiQR} alt="UPI QR" width={200} height={200} />}
          </div>

          <button
            onClick={onPaymentComplete}
            className="mt-6 w-full py-3 rounded-xl bg-[var(--accent)] text-black font-semibold"
          >
            I Have Paid
          </button>
        </div>
      )}
    </div>
  );
}
