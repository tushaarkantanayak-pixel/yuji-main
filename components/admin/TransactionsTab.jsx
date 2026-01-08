"use client";

import { useState } from "react";

export default function TransactionsTab({ transactions = [] }) {
  const [selectedTx, setSelectedTx] = useState(null);

  const statusStyle = {
    success: "bg-green-500/15 text-green-400",
    failed: "bg-red-500/15 text-red-400",
    pending: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Transactions</h2>
        <p className="text-sm text-[var(--muted)]">
          Successful and processed payments.
        </p>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-black/20 border-b border-[var(--border)]">
            <tr className="text-left text-[var(--muted)]">
              <th className="py-3 px-4">Date</th>
              <th className="px-4">Order ID</th>
              <th className="px-4">User</th>
              <th className="px-4">Game</th>
              <th className="px-4">Amount</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelectedTx(t)}
                className="border-t border-[var(--border)]
                           cursor-pointer hover:bg-white/5 transition"
              >
                <td className="py-3 px-4 text-xs text-[var(--muted)]">
                  {new Date(t.createdAt).toLocaleString()}
                </td>

                <td className="px-4 font-mono text-xs break-all">
                  {t.orderId}
                </td>

                <td className="px-4 break-all">
                  {t.email || t.userId || "—"}
                </td>

                <td className="px-4">{t.gameSlug}</td>

                <td className="px-4 font-semibold text-green-400">
                  ₹{t.price}
                </td>

                <td className="px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusStyle[t.status] || "bg-gray-500/15"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}

            {!transactions.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-[var(--muted)]"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3 overflow-x-hidden">
        {transactions.map((t) => (
          <div
            key={t._id}
            onClick={() => setSelectedTx(t)}
            className="rounded-2xl border border-[var(--border)]
                       bg-[var(--card)] p-4
                       cursor-pointer active:scale-[0.98]
                       transition overflow-hidden"
          >
            <div className="flex justify-between items-start mb-2 min-w-0">
              <div className="text-xs text-[var(--muted)] truncate">
                {new Date(t.createdAt).toLocaleDateString()}
              </div>

              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusStyle[t.status] || "bg-gray-500/15"
                }`}
              >
                {t.status}
              </span>
            </div>

            <div className="text-sm font-semibold text-green-400">
              ₹{t.price}
            </div>

            <div className="text-xs text-[var(--muted)] mt-1">
              {t.gameSlug}
            </div>

            <div className="mt-2 text-xs break-all line-clamp-1">
              {t.orderId}
            </div>

            <div className="mt-1 text-xs text-[var(--muted)] break-all truncate">
              {t.email || t.userId || "—"}
            </div>
          </div>
        ))}

        {!transactions.length && (
          <p className="text-center text-[var(--muted)] py-8">
            No transactions found
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md rounded-2xl
                          bg-[var(--card)] border border-[var(--border)]
                          p-6 overflow-hidden">

            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-3 right-3 text-[var(--muted)] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-4">
              Transaction Details
            </h3>

            <div className="space-y-3 text-sm">
              <Detail label="Order ID" value={selectedTx.orderId} />
              <Detail label="Game" value={selectedTx.gameSlug} />
              <Detail
                label="Item"
                value={`${selectedTx.itemName} (${selectedTx.itemSlug})`}
              />
              <Detail label="Player ID" value={selectedTx.playerId} />
              <Detail label="Zone ID" value={selectedTx.zoneId} />
              <Detail label="Payment Method" value={selectedTx.paymentMethod} />
              <Detail label="Amount" value={`₹${selectedTx.price}`} />
              <Detail label="Status" value={selectedTx.status} />
              <Detail label="Payment Status" value={selectedTx.paymentStatus} />
              <Detail label="Topup Status" value={selectedTx.topupStatus} />
              <Detail label="Email" value={selectedTx.email || "—"} />
              <Detail label="Phone" value={selectedTx.phone || "—"} />
              <Detail
                label="Created At"
                value={new Date(selectedTx.createdAt).toLocaleString()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= HELPER ================= */
function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 min-w-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium text-right break-words max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
