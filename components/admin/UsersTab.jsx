"use client";

export default function UsersTab({
  users,
  updatingUserId,
  onChangeRole,
}) {
  return (
    <div className="w-full space-y-4">
      {/* ===== Mobile View ===== */}
      <div className="md:hidden space-y-3">
        {users.map((u, i) => (
          <div
            key={u._id}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-[var(--muted)]">
                #{i + 1}
              </span>
              {updatingUserId === u.userId && (
                <span className="text-xs text-[var(--muted)]">
                  Updating…
                </span>
              )}
            </div>

            <p className="font-medium">{u.name}</p>
            <p className="text-sm text-[var(--muted)]">{u.email}</p>
            <p className="text-sm text-[var(--muted)]">
              📞 {u.phone || "N/A"}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">
                Orders: <b>{u.order}</b>
              </span>

              <select
                value={u.userType}
                disabled={u.userType === "owner"}
                onChange={(e) =>
                  onChangeRole(u.userId, e.target.value)
                }
                className="
                  bg-[var(--background)]
                  border border-[var(--border)]
                  rounded-lg px-3 py-1 text-sm
                "
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                {u.userType === "owner" && (
                  <option value="owner">Owner</option>
                )}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Desktop Table View ===== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] text-left">
            <tr className="text-[var(--muted)]">
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Phone</th>
              <th className="py-3 px-2">Orders</th>
              <th className="py-3 px-2">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr
                key={u._id}
                className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition"
              >
                <td className="py-3 px-2">{i + 1}</td>
                <td className="py-3 px-2 font-medium">
                  {u.name}
                </td>
                <td className="py-3 px-2">{u.email}</td>
                <td className="py-3 px-2">
                  {u.phone || "—"}
                </td>
                <td className="py-3 px-2">{u.order}</td>
                <td className="py-3 px-2 flex items-center gap-2">
                  <select
                    value={u.userType}
                    disabled={u.userType === "owner"}
                    onChange={(e) =>
                      onChangeRole(u.userId, e.target.value)
                    }
                    className="
                      bg-[var(--background)]
                      border border-[var(--border)]
                      rounded-lg px-2 py-1
                    "
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    {u.userType === "owner" && (
                      <option value="owner">Owner</option>
                    )}
                  </select>

                  {updatingUserId === u.userId && (
                    <span className="text-xs text-[var(--muted)]">
                      Updating…
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
