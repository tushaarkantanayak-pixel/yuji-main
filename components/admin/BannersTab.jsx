"use client";

import { useState } from "react";

export default function BannersTab({ banners, onRefresh }) {
  const [form, setForm] = useState({
    bannerImage: "",
    bannerTitle: "",
    bannerSlug: "",
    bannerLink: "",
    bannerSummary: "",
    gameId: "",
    isShow: true,
  });

  const [editingId, setEditingId] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= ADD / UPDATE (UNCHANGED LOGIC) ================= */
  const addBanner = async () => {
    if (!form.bannerImage || !form.bannerTitle || !form.bannerSlug) {
      alert("Image URL, Title & Slug are required");
      return;
    }

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        gameId: form.gameId
          ? form.gameId.split(",").map((g) => g.trim())
          : [],
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed to add banner");
      return;
    }

    resetForm();
    onRefresh();
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setForm({
      bannerImage: b.bannerImage || "",
      bannerTitle: b.bannerTitle || "",
      bannerSlug: b.bannerSlug || "",
      bannerLink: b.bannerLink || "",
      bannerSummary: b.bannerSummary || "",
      gameId: b.gameId?.join(", ") || "",
      isShow: b.isShow ?? true,
    });
  };

  const updateBanner = async () => {
    if (!form.bannerSlug) {
      alert("Banner slug is required");
      return;
    }

    const res = await fetch("/api/admin/banners/editbanner", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        gameId: form.gameId
          ? form.gameId.split(",").map((g) => g.trim())
          : [],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to update banner");
      return;
    }

    resetForm();
    onRefresh();
  };

  const toggleShow = async (id, isShow) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isShow: !isShow }),
    });

    onRefresh();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      bannerImage: "",
      bannerTitle: "",
      bannerSlug: "",
      bannerLink: "",
      bannerSummary: "",
      gameId: "",
      isShow: true,
    });
  };

  return (
    <div className="space-y-10">

      {/* ================= FORM ================= */}
      <div
        className={`rounded-2xl border p-6 space-y-5
        ${editingId ? "border-[var(--accent)]" : "border-[var(--border)]"}
        bg-[var(--card)]`}
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          {editingId ? "✏️ Edit Banner" : "➕ Add New Banner"}
        </h3>

        {/* Image preview */}
        {form.bannerImage && (
          <img
            src={form.bannerImage}
            alt="Banner Preview"
            className="w-full h-40 object-cover rounded-xl border"
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Banner Image URL"
            value={form.bannerImage}
            onChange={(e) =>
              setForm({ ...form, bannerImage: e.target.value })
            }
            className="input"
          />

          <input
            placeholder="Banner Title"
            value={form.bannerTitle}
            onChange={(e) =>
              setForm({ ...form, bannerTitle: e.target.value })
            }
            className="input"
          />

          <input
            placeholder="Banner Slug (unique)"
            value={form.bannerSlug}
            onChange={(e) =>
              setForm({ ...form, bannerSlug: e.target.value })
            }
            disabled={!!editingId}
            className="input disabled:opacity-60"
          />

          <input
            placeholder="Banner Link"
            value={form.bannerLink}
            onChange={(e) =>
              setForm({ ...form, bannerLink: e.target.value })
            }
            className="input"
          />
        </div>

        <input
          placeholder="Game IDs (comma separated)"
          value={form.gameId}
          onChange={(e) =>
            setForm({ ...form, gameId: e.target.value })
          }
          className="input"
        />

        <textarea
          placeholder="Banner Summary"
          value={form.bannerSummary}
          onChange={(e) =>
            setForm({ ...form, bannerSummary: e.target.value })
          }
          className="input min-h-[80px]"
        />

        {/* Visibility */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Visibility</span>

          <button
            onClick={() =>
              setForm({ ...form, isShow: true })
            }
            className={`px-3 py-1 rounded-full text-sm font-semibold
              ${form.isShow
                ? "bg-green-500/20 text-green-500"
                : "border"}`}
          >
            Visible
          </button>

          <button
            onClick={() =>
              setForm({ ...form, isShow: false })
            }
            className={`px-3 py-1 rounded-full text-sm font-semibold
              ${!form.isShow
                ? "bg-red-500/20 text-red-500"
                : "border"}`}
          >
            Hidden
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={editingId ? updateBanner : addBanner}
            className="px-5 py-2 rounded-xl bg-[var(--accent)]
                       text-black font-semibold"
          >
            {editingId ? "Update Banner" : "Add Banner"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-5 py-2 rounded-xl border"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">All Banners</h3>

        {banners.map((b) => (
          <div
            key={b._id}
            className="flex flex-col md:flex-row md:items-center
                       gap-4 border border-[var(--border)]
                       rounded-xl p-4 bg-[var(--card)]"
          >
            <img
              src={b.bannerImage}
              alt={b.bannerTitle}
              className="w-full md:w-40 h-20 object-cover rounded-lg border"
            />

            <div className="flex-1">
              <p className="font-semibold">{b.bannerTitle}</p>
              <p className="text-xs text-[var(--muted)]">
                {b.bannerSlug}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(b)}
                className="px-4 py-1.5 rounded-lg text-sm border"
              >
                Edit
              </button>

              <button
                onClick={() => toggleShow(b._id, b.isShow)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold
                  ${
                    b.isShow
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
              >
                {b.isShow ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
