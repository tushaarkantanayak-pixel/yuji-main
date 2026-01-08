"use client";

import { useState } from "react";

export default function SupportQueriesTab({ queries = [], onUpdateStatus }) {
  const [activeQuery, setActiveQuery] = useState(null);

  const statusMeta = {
    open: {
      label: "Open",
      class: "bg-yellow-500/15 text-yellow-400",
    },
    in_progress: {
      label: "In Progress",
      class: "bg-blue-500/15 text-blue-400",
    },
    resolved: {
      label: "Resolved",
      class: "bg-green-500/15 text-green-400",
    },
    closed: {
      label: "Closed",
      class: "bg-gray-500/15 text-gray-400",
    },
  };

  const getStatus = (status) => status || "open";

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Support Queries</h2>
        <p className="text-sm text-[var(--muted)]">
          Messages submitted by users.
        </p>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-black/20">
            <tr className="text-left text-[var(--muted)]">
              <th className="py-3 px-4">User</th>
              <th className="px-4">Type</th>
              <th className="px-4">Message</th>
              <th className="px-4">Status</th>
              <th className="px-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {queries.map((q) => {
              const status = getStatus(q.status);
              const meta = statusMeta[status];

              return (
                <tr
                  key={q._id}
                  onClick={() => setActiveQuery(q)}
                  className="border-t border-[var(--border)]
                             hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium break-all">
                      {q.email || "User"}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {q.phone || ""}
                    </div>
                  </td>

                  <td className="px-4 capitalize">{q.type}</td>

                  <td className="px-4 max-w-xs truncate text-[var(--muted)]">
                    {q.message}
                  </td>

                  <td className="px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${meta.class}`}
                    >
                      {meta.label}
                    </span>
                  </td>

                  <td className="px-4 text-xs text-[var(--muted)]">
                    {new Date(q.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}

            {queries.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[var(--muted)]"
                >
                  No support queries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3 overflow-x-hidden">
        {queries.map((q) => {
          const status = getStatus(q.status);
          const meta = statusMeta[status];

          return (
            <div
              key={q._id}
              onClick={() => setActiveQuery(q)}
              className="rounded-2xl border border-[var(--border)]
                         bg-[var(--card)] p-4
                         active:scale-[0.98] transition
                         overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2 min-w-0">
                <div className="font-semibold break-all truncate max-w-[70%]">
                  {q.email || q.phone || "User"}
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${meta.class}`}
                >
                  {meta.label}
                </span>
              </div>

              <div className="text-xs text-[var(--muted)] capitalize mb-1 truncate">
                {q.type}
              </div>

              <p className="text-sm text-[var(--text)]
                            break-words line-clamp-2">
                {q.message}
              </p>

              <div className="mt-2 text-xs text-[var(--muted)] truncate">
                {new Date(q.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}

        {queries.length === 0 && (
          <p className="text-center text-[var(--muted)] py-8">
            No support queries yet
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {activeQuery && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl
                          bg-[var(--card)] border border-[var(--border)]
                          p-6 space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Support Query</h3>
              <button
                onClick={() => setActiveQuery(null)}
                className="text-[var(--muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-sm">
              <Info label="Contact" value={activeQuery.email || activeQuery.phone || "-"} />
              <Info label="Type" value={activeQuery.type} capitalize />

              <div>
                <p className="text-xs text-[var(--muted)]">Message</p>
                <p className="font-medium whitespace-pre-wrap break-words max-w-full">
                  {activeQuery.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Status</p>
                <select
                  value={getStatus(activeQuery.status)}
                  onChange={(e) => {
                    onUpdateStatus(activeQuery._id, e.target.value);
                    setActiveQuery(null);
                  }}
                  className="w-full px-3 py-2 rounded-lg
                             bg-[var(--background)] border border-[var(--border)]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <p className="text-xs text-[var(--muted)]">
                Created: {new Date(activeQuery.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= HELPER ================= */
function Info({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`font-medium ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}
