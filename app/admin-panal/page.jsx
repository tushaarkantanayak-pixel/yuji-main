"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import {
  FaCrown,
  FaStar,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminPanalPage() {
  const [role, setRole] = useState("user");
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("silver");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.userType) setRole(data.userType);
        if (data?.membershipExpiresAt)
          setExpiry(new Date(data.membershipExpiresAt));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const isOwner = role === "owner";
  const isReseller = role === "admin";
  const isSilver = role === "member";
  const isUser = role === "user";

  const currentTier = isOwner
    ? "Owner"
    : isReseller
    ? "Reseller"
    : isSilver
    ? "Silver"
    : "Free User";

  const daysLeft =
    expiry
      ? Math.max(
          0,
          Math.ceil((expiry.getTime() - Date.now()) / 86400000)
        )
      : null;

  return (
    <AuthGuard>
      <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-xl">

          {/* ================= CURRENT TIER ================= */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-[var(--muted)]">Your Membership</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                {isOwner && <FaCrown className="text-yellow-400" />}
                {isReseller && <FaUserTie className="text-yellow-500" />}
                {isSilver && <FaStar className="text-gray-400" />}
                {currentTier}
              </p>
            </div>

            {(isSilver || isReseller) && expiry && (
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">Expires in</p>
                <p className="text-lg font-semibold">
                  {daysLeft} days
                </p>
              </div>
            )}
          </div>

          {/* ================= OWNER VIEW ================= */}
          {isOwner && (
            <div className="text-center py-10">
              <FaCrown className="text-5xl text-yellow-400 mx-auto mb-4" />
              <p className="text-lg font-semibold">
                Lifetime Access Enabled
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">
                You have full access to all features.
              </p>
            </div>
          )}

          {/* ================= PLANS ================= */}
          {!isOwner && (
            <>
              {/* Tabs */}
              <div className="flex justify-center gap-3 mb-8">
                <PlanTab
                  active={activeTab === "silver"}
                  label="Silver"
                  icon={<FaStar />}
                  onClick={() => setActiveTab("silver")}
                />
                <PlanTab
                  active={activeTab === "reseller"}
                  label="Reseller"
                  icon={<FaUserTie />}
                  onClick={() => setActiveTab("reseller")}
                />
              </div>

              {/* Silver Plan */}
              {activeTab === "silver" && (
                <>
                  <PerkList
                    perks={[
                      "Cheaper product pricing",
                      "Collage / Profile Maker access",
                      "ID Rent priority access",
                    ]}
                  />

                  {(isUser || isSilver) && (
                    <div className="flex justify-center mt-8">
                      <ActionButton
                        href={
                          isSilver
                            ? "/games/membership/reseller-membership"
                            : "/games/membership/silver-membership"
                        }
                        label={
                          isSilver
                            ? "Upgrade to Reseller"
                            : "Buy Silver Membership"
                        }
                        type="silver"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Reseller Plan */}
              {activeTab === "reseller" && (
                <>
                  <PerkList
                    perks={[
                      "Lowest possible prices",
                      "Bulk tools & reseller dashboard",
                      "Collage / Profile Maker access",
                      "Highest priority ID Rent access",
                    ]}
                  />

                  {(isUser || isSilver) && (
                    <div className="flex justify-center mt-8">
                      <ActionButton
                        href="/games/membership/reseller-membership"
                        label="Buy Reseller Membership"
                        type="gold"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </AuthGuard>
  );
}

/* ================= SUB COMPONENTS ================= */

function PlanTab({ active, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold
                  flex items-center gap-2 transition
        ${
          active
            ? "bg-[var(--accent)] text-black"
            : "bg-[var(--background)] border border-[var(--border)]"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PerkList({ perks }) {
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      {perks.map((perk, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-6 py-4 text-sm
            ${i % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]"}`}
        >
          <FaCheckCircle className="text-green-500 shrink-0" />
          <span>{perk}</span>
        </div>
      ))}
    </div>
  );
}

function ActionButton({ href, label, type }) {
  return (
    <Link
      href={href}
      className={`px-8 py-3 rounded-xl font-semibold text-center transition
        ${
          type === "gold"
            ? "bg-yellow-400 text-black hover:opacity-90"
            : "bg-gray-300 text-black hover:opacity-90"
        }`}
    >
      {label}
    </Link>
  );
}
