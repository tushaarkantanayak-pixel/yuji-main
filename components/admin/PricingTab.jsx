"use client";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  overrides,
  setOverrides,
  savingPricing,
  onSave,
}) {
  const canSave =
    (slabs.length > 0 || overrides.length > 0) && !savingPricing;

  /* ================= SLABS ================= */
  const updateSlab = (i, key, value) => {
    const next = [...slabs];
    next[i][key] = Number(value);
    setSlabs(next);
  };

  const addSlab = () => {
    setSlabs([...slabs, { min: 0, max: 0, percent: 0 }]);
  };

  const deleteSlab = (i) => {
    const next = slabs.filter((_, index) => index !== i);
    setSlabs(next.length ? next : [{ min: 0, max: 0, percent: 0 }]);
  };

  /* ================= FIXED PRICES ================= */
  const updateOverride = (i, key, value) => {
    const next = [...overrides];
    next[i][key] = key === "fixedPrice" ? Number(value) : value;
    setOverrides(next);
  };

  const addOverride = () => {
    setOverrides([
      ...overrides,
      { gameSlug: "", itemSlug: "", fixedPrice: 0 },
    ]);
  };

  const deleteOverride = (i) => {
    setOverrides(overrides.filter((_, index) => index !== i));
  };

  return (
    <div className="max-w-5xl space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-bold">Pricing Rules</h2>
        <p className="text-sm text-[var(--muted)]">
          Decide how much extra you earn on each order.
        </p>
      </div>

      {/* ================= USER TYPE ================= */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">Apply pricing for</span>
        <select
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-[var(--background)]"
        >
          <option value="admin">Admin Users</option>
          <option value="user">Normal Users</option>
        </select>
      </div>

      {/* ================= SLAB PRICING ================= */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">
          Price Range Markup
        </h3>
        <p className="text-sm text-[var(--muted)]">
          Add extra percentage based on item price range.
        </p>

        {/* ===== Mobile ===== */}
        <div className="md:hidden space-y-3">
          {slabs.map((s, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 space-y-3"
            >
              <input
                type="number"
                placeholder="Minimum Price (₹)"
                value={s.min}
                onChange={(e) =>
                  updateSlab(i, "min", e.target.value)
                }
                className="input"
              />
              <input
                type="number"
                placeholder="Maximum Price (₹)"
                value={s.max}
                onChange={(e) =>
                  updateSlab(i, "max", e.target.value)
                }
                className="input"
              />
              <input
                type="number"
                placeholder="Extra Charge (%)"
                value={s.percent}
                onChange={(e) =>
                  updateSlab(i, "percent", e.target.value)
                }
                className="input"
              />

              <button
                onClick={() => deleteSlab(i)}
                className="text-sm text-red-400"
              >
                Remove Range
              </button>
            </div>
          ))}
        </div>

        {/* ===== Desktop ===== */}
        <div className="hidden md:block border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/20">
              <tr>
                <th className="px-4 py-3">Min ₹</th>
                <th className="px-4 py-3">Max ₹</th>
                <th className="px-4 py-3">Extra %</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {slabs.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={s.min}
                      onChange={(e) =>
                        updateSlab(i, "min", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={s.max}
                      onChange={(e) =>
                        updateSlab(i, "max", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={s.percent}
                      onChange={(e) =>
                        updateSlab(i, "percent", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteSlab(i)}
                      className="text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addSlab}
          className="text-sm font-semibold text-[var(--accent)]"
        >
          + Add Price Range
        </button>
      </section>

      {/* ================= FIXED PRICING ================= */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">
          Fixed Item Price
        </h3>
        <p className="text-sm text-[var(--muted)]">
          This price ignores all markup rules.
        </p>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {overrides.map((o, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 space-y-3"
            >
              <input
                placeholder="Game Slug"
                value={o.gameSlug}
                onChange={(e) =>
                  updateOverride(i, "gameSlug", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Item Slug"
                value={o.itemSlug}
                onChange={(e) =>
                  updateOverride(i, "itemSlug", e.target.value)
                }
                className="input"
              />
              <input
                type="number"
                placeholder="Final Price (₹)"
                value={o.fixedPrice}
                onChange={(e) =>
                  updateOverride(i, "fixedPrice", e.target.value)
                }
                className="input"
              />
              <button
                onClick={() => deleteOverride(i)}
                className="text-sm text-red-400"
              >
                Remove Fixed Price
              </button>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/20">
              <tr>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Final ₹</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {overrides.map((o, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      value={o.gameSlug}
                      onChange={(e) =>
                        updateOverride(i, "gameSlug", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      value={o.itemSlug}
                      onChange={(e) =>
                        updateOverride(i, "itemSlug", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={o.fixedPrice}
                      onChange={(e) =>
                        updateOverride(i, "fixedPrice", e.target.value)
                      }
                      className="input"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteOverride(i)}
                      className="text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addOverride}
          className="text-sm font-semibold text-[var(--accent)]"
        >
          + Add Fixed Price
        </button>
      </section>

      {/* ================= SAVE ================= */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={!canSave}
          className={`px-6 py-2 rounded-lg font-semibold ${
            canSave
              ? "bg-[var(--accent)] text-black"
              : "bg-gray-500/40 text-gray-400 cursor-not-allowed"
          }`}
        >
          {savingPricing ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
