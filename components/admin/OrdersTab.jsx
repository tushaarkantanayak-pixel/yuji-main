"use client";

import { useState } from "react";

export default function OrdersTab({ orders = [], onUpdateStatus }) {
  const STATUS = ["pending", "success", "failed"];
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-black/20 border-b border-[var(--border)]">
            <tr className="text-left text-[var(--muted)]">
              <th className="py-3 px-4">Game</th>
              <th className="px-4">Date</th>
              <th className="px-4">Item</th>
              <th className="px-4">Price</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o._id}
                onClick={() => setSelectedOrder(o)}
                className="border-t border-[var(--border)]
                           cursor-pointer hover:bg-white/5 transition"
              >
                <td className="py-3 px-4 font-medium">
                  {o.gameSlug}
                </td>

                <td className="px-4 text-xs text-[var(--muted)]">
                  {new Date(o.createdAt).toLocaleString()}
                </td>

                <td className="px-4 truncate max-w-xs">
                  {o.itemName}
                </td>

                <td className="px-4 font-semibold">
                  ₹{o.price}
                </td>

                <td
                  className="px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={o.status}
                    disabled={o.status === "success"}
                    onChange={(e) =>
                      onUpdateStatus(o.orderId, e.target.value)
                    }
                    className={`px-3 py-1 rounded-lg text-xs border
                      ${
                        o.status === "success"
                          ? "bg-green-500/10 border-green-500 text-green-500 cursor-not-allowed"
                          : "bg-[var(--card)] border-[var(--border)]"
                      }`}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {!orders.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-[var(--muted)]"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3 overflow-x-hidden">
        {orders.map((o) => (
          <div
            key={o._id}
            onClick={() => setSelectedOrder(o)}
            className="rounded-2xl border border-[var(--border)]
                       bg-[var(--card)] p-4
                       cursor-pointer active:scale-[0.98]
                       transition overflow-hidden"
          >
            <div className="flex justify-between items-start mb-2 min-w-0">
              <div className="font-semibold truncate max-w-[70%]">
                {o.gameSlug}
              </div>

              <span className="text-xs text-[var(--muted)] shrink-0">
                {new Date(o.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="text-sm break-words line-clamp-2">
              {o.itemName}
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-green-400">
                ₹{o.price}
              </span>

              <div onClick={(e) => e.stopPropagation()}>
                <select
                  value={o.status}
                  disabled={o.status === "success"}
                  onChange={(e) =>
                    onUpdateStatus(o.orderId, e.target.value)
                  }
                  className={`px-3 py-1 rounded-lg text-xs border
                    ${
                      o.status === "success"
                        ? "bg-green-500/10 border-green-500 text-green-500 cursor-not-allowed"
                        : "bg-[var(--background)] border-[var(--border)]"
                    }`}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {!orders.length && (
          <p className="text-center text-[var(--muted)] py-8">
            No orders found
          </p>
        )}
      </div>

      {/* ================= MODAL (UNCHANGED) ================= */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </>
  );
}

/* ================= MODAL COMPONENT ================= */

function OrderModal({ order, onClose, onUpdateStatus }) {
  const STATUS = ["pending", "success", "failed"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-[var(--card)] border border-[var(--border)]
                      rounded-2xl w-full max-w-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-sm text-[var(--muted)] hover:text-red-500"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold mb-4">
          Order Details
        </h3>

        <div className="space-y-3 text-sm">
          <Detail label="Order ID" value={order.orderId} mono />
          <Detail label="Game" value={order.gameSlug} />
          <Detail label="Item Slug" value={order.itemSlug} />
          <Detail label="Item Name" value={order.itemName} />
          <Detail label="Player ID" value={order.playerId} />
          <Detail label="Zone ID" value={order.zoneId} />
          <Detail label="Payment" value={order.paymentMethod} />
          <Detail label="Email" value={order.email} />
          <Detail label="Phone" value={order.phone} />
          <Detail label="Payment Status" value={order.paymentStatus} />
          <Detail label="Topup Status" value={order.topupStatus} />
          <Detail label="Price" value={`₹${order.price}`} />
          <Detail
            label="Created"
            value={new Date(order.createdAt).toLocaleString()}
          />

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <span className="font-medium">Status</span>

            <select
              value={order.status}
              disabled={order.status === "success"}
              onChange={(e) =>
                onUpdateStatus(order.orderId, e.target.value)
              }
              className={`px-3 py-1 rounded-lg text-xs border
                ${
                  order.status === "success"
                    ? "bg-green-500/10 border-green-500 text-green-500 cursor-not-allowed"
                    : "bg-[var(--background)] border-[var(--border)]"
                }`}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */

function Detail({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4 min-w-0">
      <span className="text-[var(--muted)]">{label}</span>
      <span
        className={`${
          mono ? "font-mono text-xs" : "font-medium"
        } break-words max-w-[60%] text-right`}
      >
        {value}
      </span>
    </div>
  );
}
