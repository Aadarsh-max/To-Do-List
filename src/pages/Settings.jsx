import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Star,
  CalendarDays,
  Lock,
  Gift,
  Home,
  Palette,
  ListChecks,
  Sliders,
} from "lucide-react";

const settingsItems = [
  {
    title: "Home",
    icon: <Home className="w-6 h-6" />,
    route: "/category/all",
    color: "from-gray-500 to-zinc-500",
    description: "Return to main dashboard",
  },
  {
    title: "Themes",
    icon: <Palette className="w-6 h-6" />,
    onClick: () => document.getElementById("theme_dropdown")?.click(),
    color: "from-purple-500 to-pink-500",
    description: "Customize your appearance",
  },
  {
    title: "See Your Profile",
    icon: <User className="w-6 h-6" />,
    route: "/profile",
    color: "from-blue-500 to-cyan-500",
    description: "View and edit your profile",
  },
  {
    title: "Donate",
    icon: <Gift className="w-6 h-6" />,
    route: "/donate",
    color: "from-rose-500 to-red-500",
    description: "Support our development",
  },
  {
    title: "Calendar",
    icon: <CalendarDays className="w-6 h-6" />,
    route: "/calendar",
    color: "from-orange-500 to-amber-500",
    description: "Schedule and track events",
  },
  {
    title: "Private Tasks",
    icon: <Lock className="w-6 h-6" />,
    route: "/private-tasks",
    color: "from-indigo-500 to-sky-500",
    description: "Manage confidential tasks",
  },
  {
    title: "Starred Tasks",
    icon: <Star className="w-6 h-6" />,
    route: "/starredtask",
    color: "from-yellow-500 to-orange-500",
    description: "View your important tasks",
  },
  {
    title: "Task Templates",
    icon: <ListChecks className="w-6 h-6" />,
    route: "/tasktemplates",
    color: "from-green-500 to-emerald-500",
    description: "Reusable task blueprints",
  },
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Sliders className="w-7 h-7 text-primary-content" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-base-content mb-3">
            Settings
          </h1>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
            Customize your experience and manage your preferences. Access all
            your tools and features in one place.
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {settingsItems.map((item, index) => (
            <motion.div
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              onClick={item.onClick ? item.onClick : () => navigate(item.route)}
              className="card bg-base-100 shadow-xl hover:shadow-2xl cursor-pointer border border-base-300 transition-all duration-300"
            >
              <div className="card-body flex flex-col items-center py-8 px-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4 text-white`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-base-content text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/60 text-center">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
