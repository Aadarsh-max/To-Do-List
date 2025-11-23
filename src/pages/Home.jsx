import React, { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import { FaPlus } from "react-icons/fa";
import TaskCard from "../components/TaskCard";
import TaskTemplateCard from "../components/TaskTemplateCard";
import PageLoader from "../components/PageLoader";
import { auth } from "../firebase/config";
import { normalizeDateTime } from "../utils/dateTimeUtil.js";
import ExportPreview from "../components/ExportPreview.jsx";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", datetime: "" });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showExport, setShowExport] = useState(false);

  const categories = [
    { name: "All", key: "all", icon: "📋", color: "from-gray-500 to-gray-600" },
    {
      name: "Work",
      key: "work",
      icon: "💼",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Personal",
      key: "personal",
      icon: "👤",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Wishlist",
      key: "wishlist",
      icon: "🎁",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Birthdays",
      key: "birthdays",
      icon: "🎂",
      color: "from-orange-500 to-amber-500",
    },
    {
      name: "Special",
      key: "special",
      icon: "⭐",
      color: "from-emerald-500 to-green-500",
    },
  ];

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTasks(currentUser.email);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async (email) => {
    try {
      const res = await API.get("/tasks");
      const userTasks = res.data.filter((task) => task.email === email);
      setTasks(
        userTasks.map((task, index) => ({
          ...task,
          originalIndex: index, // preserve original order
        }))
      );
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return selectedCategory === "all"
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in to add tasks");
      return;
    }

    const defaultDateTime = new Date().toISOString().slice(0, 16);
    const currentCategory =
      selectedCategory === "all" ? "personal" : selectedCategory;

    const task = {
      title: newTask.title.trim(),
      category: currentCategory,
      datetime: newTask.datetime || defaultDateTime,
      completed: false,
      email: currentUser.email,
    };

    try {
      const res = await API.post("/tasks", task);
      setTasks((prev) => [
        { ...res.data, originalIndex: prev.length },
        ...prev,
      ]);
      setShowModal(false);
      setNewTask({ title: "", datetime: "" });
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const getSelectedCategoryData = () =>
    categories.find((cat) => cat.key === selectedCategory) || categories[0];

  const categoryData = getSelectedCategoryData();

  if (loading) return <PageLoader message="Loading your tasks..." />;
  if (!user) return <PageLoader message="Loading Profile..." />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Category Header */}
      <div
        className={`relative bg-gradient-to-r ${categoryData.color} p-8 mb-8 shadow-xl`}
      >
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Export / Share
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">{categoryData.icon}</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                {categoryData.name} Tasks
              </h1>
              <p className="text-white/90 text-sm mt-1">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"}
                {selectedCategory !== "all" && " in this category"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat.key
                    ? "bg-white text-gray-800 shadow-lg scale-105"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                  {selectedCategory === cat.key && filteredTasks.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {filteredTasks.length}
                    </span>
                  )}
                </div>
                {selectedCategory === cat.key && (
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} setTasks={setTasks} />
            ))}
          </div>
        ) : (
          <div className="bg-base-100 rounded-3xl shadow-xl border-2 border-dashed border-base-300 p-12">
            <TaskTemplateCard />
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowModal(true)}
        className="group fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-white p-5 rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 z-40"
      >
        <FaPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Add Task Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-base-100 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-primary/20"
          >
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
              Add New Task
            </h2>

            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="input input-bordered w-full mb-4"
            />

            <div className="relative w-full">
              <input
                type="datetime-local"
                value={normalizeDateTime(newTask.datetime)}
                onChange={(e) =>
                  setNewTask({ ...newTask, datetime: e.target.value })
                }
                className="input input-bordered w-full mb-1 peer"
              />
              {/* TIME HINT (visible on mobile) */}
              {!newTask.datetime && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm peer-focus:hidden">
                  Select date & time ⏳
                </span>
              )}
              <p className="text-xs text-gray-400 pl-1 -mt-1">
                📌 Pick a reminder time
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="btn btn-primary flex-1"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showExport && (
        <ExportPreview
          tasks={filteredTasks}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

export default Home;
