"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiPlus } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import logo from "@/public/logo.png"; // adjust path if needed


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // 👈 single source of truth

  const dropdownRef = useRef(null);

  // ---------------- FETCH USER FROM JWT ----------------
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          sessionStorage.removeItem("token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  // ---------------- SCROLL EFFECT ----------------
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ----------------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md shadow-md bg-[var(--card)]/80 border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
<div className="max-w-6xl mx-auto flex items-center justify-between px-1 h-16">

        {/* LOGO */}
<Link href="/" className="flex items-center">
  <Image
    src={logo}
    alt="yuji Logo"
    width={90}
    height={28}
    priority
    className="object-contain"
  />
</Link>



        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-6 text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          <Link href="/region" className="hover:text-[var(--foreground)]">Region</Link>
          <Link href="/services" className="hover:text-[var(--foreground)]">Services</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <ThemeToggle />

          {/* USER AVATAR */}
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold"
          >
            {user ? user.name?.charAt(0)?.toUpperCase() : <FaUser />}
          </button>

          {/* USER DROPDOWN */}
          {userMenuOpen && !loading && (
            <div className="absolute right-0 top-14 w-64 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-4 z-50">

              {!user ? (
                <Link
                  href="/login"
                  className="block py-2 hover:text-[var(--accent)]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Login / Register
                </Link>
              ) : (
                <>
                  {/* WALLET */}
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}>
                    <div className="flex items-center justify-between bg-[var(--background)] px-3 py-2 rounded-lg border border-[var(--border)] mb-3">
                      <span className="text-[var(--accent)] font-semibold">
                        ₹{user.wallet}
                      </span>
                      <FiPlus size={18} className="text-[var(--accent)]" />
                    </div>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="block py-2 hover:text-[var(--accent)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                      <Link
                    href="/dashboard"
                    className="block py-2 hover:text-[var(--accent)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Customer Support
                  </Link>
                    <Link
                    href="/dashboard"
                    className="block py-2 hover:text-[var(--accent)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                   Account Settings
                  </Link>
                   <Link
                    href="/leaderboard"
                    className="block py-2 hover:text-[var(--accent)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                   Leader Board
                  </Link>
                   <Link
                    href="/admin-panal"
                    className="block py-2 hover:text-[var(--accent)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                  Membership
                  </Link>

                  {/* ADMIN / OWNER */}
                  {( user.userType === "owner") && (
                    <Link
                      href="/owner-panal"
                      className="block py-2 hover:text-[var(--accent)]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                 

                  <button
                    onClick={handleLogout}
                    className="block text-left w-full py-2 text-red-500 hover:text-red-400"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}

          {/* MOBILE MENU ICON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[var(--foreground)] text-3xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[300px]" : "max-h-0"
        } bg-[var(--card)] border-t border-[var(--border)]`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-[var(--muted)]">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/region" onClick={() => setMenuOpen(false)}>Region</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        </nav>
      </div>
    </header>
  );
}
