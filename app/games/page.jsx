"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiX } from "react-icons/fi";
import logo from "@/public/logo.png";
import GamesFilterModal from "@/components/Games/GamesFilterModal";

export default function GamesPage() {
  const [category, setCategory] = useState([]);
  const [games, setGames] = useState([]);
  const [otts, setOtts] = useState(null);

  const [memberships, setMemberships] = useState(null);
  /* ================= FILTER STATE ================= */
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState("az"); // az | za
  const [hideOOS, setHideOOS] = useState(false);
  const [search, setSearch] = useState("");

  /* ================= CONFIG ================= */
  const SPECIAL_MLBB_GAME = "MLBB SMALL";

  const outOfStockGames = [
    // "PUBG Mobile",
    "Genshin Impact",
    "Honor Of Kings",
    "TEST 1",
    "Wuthering of Waves",
    "Where Winds Meet"
  ];

  const isOutOfStock = (name) => outOfStockGames.includes(name);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        setCategory(data?.data?.category || []);
              const fetchedOtts = data?.data?.otts || null;

                    const fetchedMemberships = data?.data?.memberships || null;
                      setOtts(fetchedOtts);
            setMemberships(fetchedMemberships);

        setGames(
          (data?.data?.games || []).map((g) =>
            g.gameName === "PUBG Mobile"
              ? { ...g, gameName: "BGMI" }
              : g
          )
        );
      });
  }, []);

  /* ================= ACTIVE FILTER COUNT ================= */
  const activeFilterCount =
    (sort !== "az" ? 1 : 0) + (hideOOS ? 1 : 0);

  /* ================= FILTER + SORT + SEARCH ================= */
  const processGames = (list) => {
    let filtered = [...list];

    if (hideOOS) {
      filtered = filtered.filter(
        (g) => !isOutOfStock(g.gameName)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.gameName.toLowerCase().includes(q) ||
          g.gameFrom?.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) =>
      sort === "az"
        ? a.gameName.localeCompare(b.gameName)
        : b.gameName.localeCompare(a.gameName)
    );

    return filtered;
  };

  /* ================= PIN MLBB GAME ================= */
  const injectSpecialGame = (cat) => {
    if (
      !cat.categoryTitle
        ?.toLowerCase()
        .includes("mobile legends")
    ) {
      return cat.gameId;
    }

    const specialGame = games.find(
      (g) => g.gameName === SPECIAL_MLBB_GAME
    );

    if (!specialGame) return cat.gameId;

    const withoutDuplicate = cat.gameId.filter(
      (g) => g.gameName !== SPECIAL_MLBB_GAME
    );

    return [specialGame, ...withoutDuplicate];
  };

  /* ================= GAME CARD ================= */
  const GameCard = ({ game }) => {
    const disabled = isOutOfStock(game.gameName);

    return (
      <Link
        href={disabled ? "#" : `/games/${game.gameSlug}`}
        className={`group relative rounded-2xl overflow-hidden
        bg-[var(--card)] border transition-all duration-300
        ${
          disabled
            ? "opacity-40 pointer-events-none"
            : "hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--accent)]"
        }`}
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={game.gameImageId?.image || logo}
            alt={game.gameName}
            fill
            className={`object-cover transition-transform duration-500
            ${disabled ? "grayscale" : "group-hover:scale-110"}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {!disabled && game.tagId && (
            <span
              className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-semibold shadow"
              style={{
                background: game.tagId.tagBackground,
                color: game.tagId.tagColor,
              }}
            >
              {game.tagId.tagName}
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-sm font-semibold text-white truncate">
              {game.gameName}
            </h3>
            <p className="text-xs text-white/70 truncate">
              {game.gameFrom}
            </p>
          </div>

          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition">
              <span className="px-5 py-2 rounded-xl text-sm font-semibold
              bg-[var(--accent)] text-black shadow-xl">
                Buy Now
              </span>
            </div>
          )}

          {disabled && (
            <span className="absolute top-3 right-3 text-[10px]
            px-2 py-1 rounded-full bg-red-600 text-white">
              Out of Stock
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ================= SEARCH + FILTER BAR ================= */}
      <div className="sticky top-16 z-40 bg-[var(--background)]/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 px-4 py-3">

          {/* SEARCH */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full rounded-xl border bg-[var(--card)]
              px-4 py-2 text-sm outline-none
              focus:border-[var(--accent)]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2
                text-[var(--muted)] hover:text-red-500"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* CLEAR */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSort("az");
                setHideOOS(false);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border
              bg-[var(--card)] text-sm
              hover:border-red-500 hover:text-red-500"
            >
              <FiX />
              Clear
            </button>
          )}

          {/* FILTER */}
          <button
            onClick={() => setShowFilter(true)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border
            transition-all
            ${
              activeFilterCount > 0
                ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                : "bg-[var(--card)] hover:border-[var(--accent)]"
            }`}
          >
            <FiFilter className="text-lg" />
            <span className="text-sm font-medium">Filter</span>

            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
              flex items-center justify-center text-[10px]
              rounded-full bg-black text-white font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= CATEGORY SECTIONS ================= */}
      <div className="px-4 py-10 space-y-14">
        {category.map((cat, i) => {
          const merged = injectSpecialGame(cat);
          const filtered = processGames(merged);
          if (!filtered.length) return null;

          return (
            <div key={i} className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-5 px-1">
                {cat.categoryTitle}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {filtered.map((game, index) => (
                  <GameCard key={index} game={game} />
                ))}
              </div>
            </div>
          );
        })}

        {/* ================= ALL GAMES ================= */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-5 px-1">
            All Games
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {processGames(games).map((game, i) => (
              <GameCard key={i} game={game} />
            ))}
          </div>
        </div>
      </div>

      {memberships?.items?.length > 0 && (
  <div className="max-w-7xl mx-auto mb-14">
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">
        {memberships.title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
      <span className="text-sm text-[var(--muted)]">
        {memberships.total} plans
      </span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {memberships.items.map((plan) => (
        <Link
          key={plan.slug}
          href={`/games/membership/${plan.slug}`}
          className="group rounded-2xl bg-[var(--card)]
                     border border-[var(--border)]
                     hover:border-[var(--accent)]
                     transition-all duration-300
                     p-5 flex flex-col items-center text-center"
        >
          <div className="relative w-20 h-20 mb-4">
            <Image
              src={plan.image}
              alt={plan.name}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-semibold text-[var(--foreground)]">
            {plan.name}
          </h3>

          <span className="mt-1 text-xs text-[var(--muted)]">
            {plan.duration}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}


      {/* ================= FILTER MODAL ================= */}
      {showFilter && (
        <GamesFilterModal
          open={showFilter}
          onClose={() => setShowFilter(false)}
          sort={sort}
          setSort={setSort}
          hideOOS={hideOOS}
          setHideOOS={setHideOOS}
        />
      )}
    </section>
  );
}
