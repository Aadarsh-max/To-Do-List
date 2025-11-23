import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;
  const hideNavbar = currentPath === "/login" || currentPath === "/signup";
  const hideSearchBar =
    currentPath === "/private-tasks" ||
    currentPath === "/settings" ||
    currentPath === "/donate";

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  // 🔥 Hardcoded custom theme circles
  const themeColors = {
    light: "bg-[#FEE6A5]",
    dark: "bg-[#1E1E1E]",
    cupcake: "bg-[#F5C6EC]",
    bumblebee: "bg-[#F9D72F]",
    emerald: "bg-[#4CCB89]",
    corporate: "bg-[#3A7AFE]",
    synthwave: "bg-[#FF00C8]",
    retro: "bg-[#EFC075]",
    valentine: "bg-[#FF6A88]",
    halloween: "bg-[#FF6F00]",
    garden: "bg-[#64C67A]",
    forest: "bg-[#23593E]",
    aqua: "bg-[#22D3EE]",
    lofi: "bg-[#C8C0B4]",
    pastel: "bg-[#FFD1DC]",
    fantasy: "bg-[#C679E3]",
    wireframe: "bg-[#BDBDBD]",
    black: "bg-[#000000]",
    luxury: "bg-[#B68C28]",
    dracula: "bg-[#FF6E96]",
    cmyk: "bg-[#00A4E4]",
    autumn: "bg-[#D2691E]",
    business: "bg-[#005691]",
    acid: "bg-[#C6FF00]",
    lemonade: "bg-[#FDE047]",
    night: "bg-[#1B263B]",
    coffee: "bg-[#A47A56]",
    winter: "bg-[#7EBCF1]",
    dim: "bg-[#4B5563]",
    nord: "bg-[#88C0D0]",
    sunset: "bg-[#FF7E47]",
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setIsThemeOpen(false);
  };

  const handleProfileClick = () => (window.location.href = "/profile");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("taskSearch", { detail: searchTerm })
      );
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: true }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: false }));
      window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: true }));
    }, 0);
    window.dispatchEvent(new CustomEvent("sidebarOpenRequest"));
  };

  const handleMobileToggle = () => {
    window.dispatchEvent(new CustomEvent("mobileSidebarToggle"));
  };

  const handleHamburger = () => {
    const detail = window.__SIDEBAR_OPEN__ ? false : true;
    window.__SIDEBAR_OPEN__ = detail;
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail }));
  };

  if (hideNavbar) return null;

  return (
    <>
      <div
        className={`navbar bg-base-100 sticky top-0 z-50 transition-all duration-300 px-2 sm:px-4 ${
          isScrolled ? "shadow-lg backdrop-blur-md bg-opacity-95" : "shadow-md"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={handleHamburger}
            className="lg:hidden p-2 rounded-lg bg-base-200 shadow border border-base-300 hover:scale-105 transition-transform flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link to="/category/all">
            <a className="btn btn-ghost btn-sm sm:btn-md normal-case text-base sm:text-lg lg:text-xl font-bold hover:scale-105 transition-transform px-2 sm:px-4 min-w-0">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse-slow truncate">
                ✓ ToDoList
              </span>
            </a>
          </Link>
        </div>

        {!hideSearchBar && (
          <div className="flex-1 flex justify-center lg:justify-start min-w-0 mx-2">
            <div className="hidden lg:block w-full max-w-xs xl:max-w-sm">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full input-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="lg:hidden">
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen((s) => !s)}
                  className="p-2 rounded-lg hover:bg-base-200 transition-all flex-shrink-0"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    />
                  </svg>
                </button>
                {isSearchOpen && (
                  <div className="fixed left-4 right-4 top-16 z-50 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input input-bordered w-full rounded-xl shadow-xl"
                      autoFocus
                      onBlur={() =>
                        setTimeout(() => setIsSearchOpen(false), 200)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-none gap-1 sm:gap-2 flex items-center flex-shrink-0">
          <div className="tooltip tooltip-bottom" data-tip="Profile">
            <button
              onClick={handleProfileClick}
              className="btn btn-ghost btn-sm sm:btn-md btn-circle hover:bg-primary hover:bg-opacity-20 transition-all duration-300 group"
              aria-label="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsThemeOpen((s) => !s)}
              id="theme_dropdown"
              className="btn btn-ghost btn-sm sm:btn-md gap-1 sm:gap-2 hover:bg-primary hover:bg-opacity-20 transition-all duration-300 group px-2 sm:px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span className="hidden sm:inline text-sm">Theme</span>
            </button>

            {isThemeOpen && (
              <div className="dropdown-content z-[1] mt-3 w-52 sm:w-56 bg-base-100 rounded-box shadow-xl border border-base-300 animate-fade-in max-h-96 overflow-y-auto right-0 absolute">
                <ul className="menu p-2">
                  {themes.map((theme, index) => (
                    <li
                      key={theme}
                      style={{ animationDelay: `${index * 15}ms` }}
                      className="animate-slide-in"
                    >
                      <button
                        className="capitalize hover:bg-primary hover:text-primary-content transition-all duration-200 rounded-lg hover:translate-x-1 w-full text-left text-sm"
                        onClick={() => changeTheme(theme)}
                      >
                        <span className="flex items-center gap-2 w-full min-w-0">
                          {/* 👇 replaced with hardcoded theme colors */}
                          <span
                            className={`w-4 h-4 flex-shrink-0 rounded-full shadow-sm ${themeColors[theme]}`}
                          ></span>
                          <span className="truncate">{theme}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse-slow { 0%,100% { opacity: 1; } 50% { opacity: 0.8; } }
        .animate-fade-in { animation: fade-in 0.28s ease-out; }
        .animate-slide-in { animation: slide-in 0.28s ease-out forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: hsl(var(--p)/0.3); border-radius: 3px; }
      `}</style>
    </>
  );
};

export default Navbar;
