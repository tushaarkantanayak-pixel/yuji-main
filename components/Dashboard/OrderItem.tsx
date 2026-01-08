"use client";

import { JSX, useState } from "react";
import {
  FiChevronDown,
  FiUser,
  FiGrid,
  FiCreditCard,
  FiShoppingBag,
} from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";

type OrderType = {
  orderId: string;
  gameSlug: string;
  itemName: string;
  playerId: string;
  zoneId: string;
  paymentMethod: string;
  price: number;
  status: string;
  topupStatus?: string;
  createdAt: string;
};

interface OrderItemProps {
  order: OrderType;
}

export default function OrderItem({ order }: OrderItemProps) {
  const [open, setOpen] = useState(false);

  const finalStatus = order.topupStatus || order.status;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    }
  };

  const getGameName = (slug: string) => {
    if (!slug) return "-";
    if (slug.toLowerCase().includes("mlbb")) {
      return "Mobile Legends";
    }
    return slug;
  };

  return (
    <div
      onClick={() => setOpen(!open)}
      className="p-5 rounded-2xl border border-[var(--border)]
                 bg-[var(--card)] shadow-sm cursor-pointer
                 transition-all hover:shadow-lg
                 hover:border-[var(--accent)]/40
                 active:scale-[0.99] select-none"
    >
      {/* TOP */}
      <div className="flex justify-between items-start gap-4 min-w-0">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold truncate">
            {order.orderId}
          </p>

          <p className="text-xs text-[var(--muted)] mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <p className="text-xl font-semibold mt-2">
            ₹{order.price}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`px-3 py-1 text-xs rounded-lg font-semibold ${getStatusStyle(
              finalStatus
            )}`}
          >
            {finalStatus.toUpperCase()}
          </span>

          <div
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <FiChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* EXPANDED */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[420px] mt-4" : "max-h-0"
        }`}
      >
        <div className="pt-4 border-t border-[var(--border)] text-sm space-y-3">

          <Detail icon={<FaGamepad />} label="Game">
            {getGameName(order.gameSlug)}
          </Detail>

          <Detail icon={<FiUser />} label="Player ID">
            {order.playerId}
          </Detail>

          <Detail icon={<FiGrid />} label="Zone ID">
            {order.zoneId}
          </Detail>

          <Detail icon={<FiCreditCard />} label="Payment">
            {order.paymentMethod?.toUpperCase()}
          </Detail>

          <div className="p-3 rounded-xl bg-[var(--background)]/40
                          border border-[var(--border)] mt-2">
            <div className="flex items-center gap-2 mb-1 text-[var(--muted)] text-xs">
              <FiShoppingBag />
              Item Details
            </div>
            <p className="font-medium break-words">
              {order.itemName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */

function Detail({
  icon,
  label,
  children,
}: {
  icon: JSX.Element;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[var(--muted)] mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="font-medium break-all">{children}</p>
      </div>
    </div>
  );
}
