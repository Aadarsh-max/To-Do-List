import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase/config.js";
import API from "../services/api.js";

const recurringTasks = {
  work: [
    "Plan daily work schedule",
    "Follow project deadlines",
    "Attend team meetings on time",
    "Review and commit code",
    "Keep workspace clean and organized",
    "Update project progress",
    "Balance work and personal life",
    "Reply to important emails",
    "Take short breaks during work",
    "Learn or improve a new skill",
    "Avoid multitasking & focus on one task at a time",
    "Set weekly goals and track progress",
  ],

  personal: [
    "Drink enough water throughout the day",
    "Exercise or go for a walk",
    "Read a few pages of a book",
    "Meditate or practice mindfulness",
    "Spend time with family or friends",
    "Plan tomorrow's routine",
    "Clean and organize your room",
    "Limit screen time and social media",
    "Reflect on your day and journal",
    "Sleep on time and get enough rest",
    "Take care of mental health and relax",
    "Do something creative that makes you happy",
  ],

  wishlist: [
    "Buy a new smartphone",
    "Get a smartwatch or fitness band",
    "Purchase a new laptop",
    "Buy noise-cancelling headphones",
    "Upgrade your workspace setup",
    "Plan and book a vacation trip",
    "Order new clothes or shoes",
    "Buy a camera or GoPro",
    "Explore a new hobby or activity",
    "Save up for a new bike or car",
    "Buy books or online courses you always wanted",
    "Build a dream PC setup someday",
  ],

  birthdays: [
    "Wish friends and family on their birthdays",
    "Buy a birthday gift",
    "Send birthday wishes on social media",
    "Call or video chat with the birthday person",
    "Plan a surprise for someone special",
    "Bake or order a birthday cake",
    "Write a personalized birthday message or card",
    "Update birthday reminders and calendar",
    "Capture birthday memories with photos",
    "Organize or attend a birthday celebration",
    "Plan a group contribution or surprise party",
    "Prepare a birthday slideshow or memory reel",
  ],

  special: [
    "Plan gifts for upcoming festivals or holidays",
    "Decorate home for special occasions",
    "Send greetings or wishes to loved ones",
    "Prepare festive meals or sweets",
    "Buy new clothes for the occasion",
    "Capture photos and memories",
    "Attend or host family gatherings",
    "Donate or help others during festivals",
    "Create a special playlist or vibe for the day",
    "Update calendar with upcoming events and holidays",
    "Plan a special self-care or celebration day",
    "Create DIY decorations or handmade gifts",
  ],
};

const categoryInfo = {
  work: {
    name: "Work",
    icon: "💼",
    color: "from-blue-500 to-cyan-500",
    badge: "bg-blue-500",
  },
  personal: {
    name: "Personal",
    icon: "👤",
    color: "from-purple-500 to-pink-500",
    badge: "bg-purple-500",
  },
  wishlist: {
    name: "Wishlist",
    icon: "🎁",
    color: "from-pink-500 to-rose-500",
    badge: "bg-pink-500",
  },
  birthdays: {
    name: "Birthdays",
    icon: "🎂",
    color: "from-orange-500 to-amber-500",
    badge: "bg-orange-500",
  },
  special: {
    name: "Special Occasions",
    icon: "⭐",
    color: "from-emerald-500 to-green-500",
    badge: "bg-emerald-500",
  },
};

const TaskTemplateList = () => {
  const [addingTask, setAddingTask] = useState(null);
  const [toast, setToast] = useState(null);

  const handleAddTask = async (taskTitle, categoryKey) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add tasks.");
      return;
    }

    const newTask = {
      title: taskTitle,
      category: categoryKey,
      datetime: new Date().toISOString(),
      firebaseUID: user.uid,
    };

    try {
      setAddingTask(taskTitle);
      await API.post("/tasks", newTask);
      setToast({
        type: "success",
        text: `"${taskTitle}" added to ${categoryKey} tasks!`,
      });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to add task. Try again." });
    } finally {
      setAddingTask(null);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="
      text-5xl 
      font-extrabold 
      bg-gradient-to-r from-primary to-secondary 
      bg-clip-text text-transparent 
      mb-3 
      leading-[1.2]          /* fixes descender clipping */
      pb-[4px]               /* adds padding to bottom for g/y */
      overflow-visible       /* ensures full render */
    "
            style={{ display: "inline-block" }} // ✅ prevents clipping within flex
          >
            Task Templates
          </h1>

          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Quick-add your daily routines and important reminders to stay
            organized
          </p>
          <div className="divider max-w-md mx-auto"></div>
        </motion.div>

        {/* Category Sections */}
        <div className="space-y-10">
          {Object.entries(recurringTasks).map(([key, tasks], idx) => {
            const { name, icon, color, badge } = categoryInfo[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                  {/* Category Header */}
                  <div
                    className={`bg-gradient-to-r ${color} p-6 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <span className="text-3xl">{icon}</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                            {name}
                          </h2>
                          <p className="text-white/90 text-sm mt-1">
                            {tasks.length} quick tasks available
                          </p>
                        </div>
                      </div>
                      <div
                        className={`badge ${badge} badge-lg text-white font-bold shadow-lg hidden sm:flex`}
                      >
                        {tasks.length}
                      </div>
                    </div>
                  </div>

                  {/* Tasks Grid */}
                  <div className="p-6 bg-base-50">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tasks.map((task, i) => (
                        <motion.div
                          key={i}
                          className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                          whileHover={{ y: -5 }}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <div className="card-body p-5">
                            <div className="flex items-start gap-3 mb-4">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}
                              >
                                <span className="text-white font-bold text-sm">
                                  {i + 1}
                                </span>
                              </div>
                              <p className="font-medium text-base-content leading-relaxed flex-1 min-h-[3rem] flex items-center">
                                {task}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddTask(task, key)}
                              disabled={addingTask === task}
                              className={`btn btn-sm gap-2 ${
                                addingTask === task
                                  ? "btn-disabled loading"
                                  : "btn-primary hover:btn-secondary"
                              } shadow-md`}
                            >
                              {addingTask === task ? (
                                <>
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  Add to Tasks
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Toast Notification */}
      {toast && (
        <motion.div
          className="toast toast-top toast-end z-[9999]"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            } shadow-2xl border-2 ${
              toast.type === "success" ? "border-success" : "border-error"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {toast.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span className="font-semibold">{toast.text}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskTemplateList;
