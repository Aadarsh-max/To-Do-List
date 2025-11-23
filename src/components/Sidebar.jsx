import React, { useEffect, useState } from "react";
import { AiOutlineStar, AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { BiCoffeeTogo, BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { RiYoutubeLine, RiInstagramLine } from "react-icons/ri";
import { IoChevronDownOutline } from "react-icons/io5";
import { FaLock, FaCalendarCheck, FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [followOpen, setFollowOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const categories = [
    { name: "All Tasks", path: "all" },
    { name: "Work Tasks", path: "work" },
    { name: "Personal Tasks", path: "personal" },
    { name: "Wishlist", path: "wishlist" },
    { name: "Birthdays", path: "birthdays" },
    { name: "Special Occasions", path: "special" },
  ];

  const socialLinks = [
    {
      name: "YouTube",
      url: "https://www.youtube.com/@SkillCoder-By_Aadarsh",
      icon: <RiYoutubeLine className="w-4 h-4" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/skillcoders_by_aadarsh",
      icon: <RiInstagramLine className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const onToggle = (e) => {
      const val = Boolean(e?.detail);
      setMobileOpen(val);
      window.__SIDEBAR_OPEN__ = val;
    };
    const onMobileToggle = () => setMobileOpen((s) => !s);
    window.addEventListener("sidebarToggle", onToggle);
    window.addEventListener("mobileSidebarToggle", onMobileToggle);
    return () => {
      window.removeEventListener("sidebarToggle", onToggle);
      window.removeEventListener("mobileSidebarToggle", onMobileToggle);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    window.__SIDEBAR_OPEN__ = false;
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: false }));
  };

  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-base-200 flex flex-col shadow-xl border-r border-base-300 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ width: "18rem" }}
      >
        <div className="p-4 sm:p-6 border-b border-base-300 flex items-start justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-base-content">
              To Do List
            </h2>
            <p className="text-xs text-base-content/60 mt-1">
              Organize your life
            </p>
          </div>
          <div className="lg:hidden">
            <button
              onClick={closeMobile}
              className="p-2 rounded-md bg-base-100 hover:bg-base-200 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-3">
            <Link to="/starredtask" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <AiOutlineStar className="w-5 h-5 text-warning group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Starred Tasks</span>
              </button>
            </Link>

            <div className="mt-2">
              <button
                onClick={() => setCategoryOpen((s) => !s)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-base-300 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <MdOutlineCategory className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <IoChevronDownOutline
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoryOpen && (
                <div className="mt-1 ml-3 border-l-2 border-base-300 pl-3 space-y-1">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.path}`}
                      className="block px-2 py-2 rounded-md text-sm hover:bg-base-300 transition-colors"
                      onClick={closeMobile}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="divider my-3" />

            <Link to="/profile" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <AiOutlineUser className="w-5 h-5 text-base-content/70 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Profile</span>
              </button>
            </Link>

            <Link to="/calendar" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <FaCalendarCheck className="w-5 h-5 text-base-content/70 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Calendar</span>
              </button>
            </Link>

            <Link to="/private-tasks" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <FaLock className="w-5 h-5 text-base-content/70 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Private Tasks</span>
              </button>
            </Link>

            <Link to="/tasktemplates" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <FaTasks className="w-5 h-5 text-base-content/70 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Task Templates</span>
              </button>
            </Link>

            <Link to="/donate" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <BiCoffeeTogo className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Donate</span>
              </button>
            </Link>

            <a
              href="mailto:aadarshshrivastavwork@gmail.com"
              className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-base-300 transition-all duration-200 group"
            >
              <BiMessageSquareDetail className="w-5 h-5 text-info group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Feedback</span>
            </a>

            <div className="mt-2">
              <button
                onClick={() => setFollowOpen((s) => !s)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-base-300 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <FiShare2 className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Follow Us</span>
                </div>
                <IoChevronDownOutline
                  className={`w-4 h-4 transition-transform duration-200 ${
                    followOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {followOpen && (
                <div className="mt-1 ml-3 border-l-2 border-base-300 pl-3 space-y-1">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-base-300 transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link to="/settings" onClick={closeMobile}>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-4 rounded-lg hover:bg-base-300 transition-all duration-200 group">
                <AiOutlineSetting className="w-5 h-5 text-base-content/70 group-hover:scale-110 group-hover:rotate-90 transition-all" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </Link>
          </nav>
        </div>

        <div className="p-3 sm:p-4 border-t border-base-300 bg-base-200/50">
          <p className="text-xs text-center text-base-content/50">
            &copy; 2025 Aadarsh. All rights reserved.
          </p>
        </div>
      </aside>
      <style>{`
        @media (min-width:1024px) {
          main, .content-root { transform: none !important; margin-left: 0 !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
