import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config.js";
import API from "../services/api.js";
import { FaPlus } from "react-icons/fa";
import TaskCard from "../components/TaskCard";
import TaskTemplateCard from "../components/TaskTemplateCard";
import { normalizeDateTime } from "../utils/dateTimeUtil.js";
import ExportPreview from "../components/ExportPreview.jsx";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", datetime: "" });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Sorting state
  const [sortType, setSortType] = useState("Newest");
  const sortingOptions = [
    "Newest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Completed First",
    "Uncompleted First",
  ];

  const categories = [
    { name: "All", key: "all" },
    { name: "Work", key: "work" },
    { name: "Personal", key: "personal" },
    { name: "Wishlist", key: "wishlist" },
    { name: "Birthdays", key: "birthdays" },
    { name: "Special", key: "special" },
  ];

  const fetchTasks = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await API.get(`/tasks?uid=${user.uid}`);
      const tasksWithIndex = res.data.map((task, index) => ({
        ...task,
        originalIndex: index,
      }));
      setTasks(tasksWithIndex);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [categoryName]);

  const filteredTasks = (
    categoryName === "all"
      ? tasks
      : tasks.filter((t) => t.category === categoryName)
  ).sort((a, b) => {
    if (sortType === "Newest")
      return new Date(b.datetime) - new Date(a.datetime);
    if (sortType === "Oldest")
      return new Date(a.datetime) - new Date(b.datetime);
    if (sortType === "A to Z") return a.title.localeCompare(b.title);
    if (sortType === "Z to A") return b.title.localeCompare(a.title);
    if (sortType === "Completed First")
      return (b.completed === true) - (a.completed === true);
    if (sortType === "Uncompleted First")
      return (a.completed === true) - (b.completed === true);
    return 0;
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newTask.title.trim()) return;

    setAdding(true);

    const defaultDateTime = new Date().toISOString().slice(0, 16);
    const currentCategory = categoryName === "all" ? "personal" : categoryName;

    const task = {
      title: newTask.title.trim(),
      category: currentCategory,
      datetime: newTask.datetime || defaultDateTime,
      completed: false,
      firebaseUID: user.uid,
    };

    try {
      const res = await API.post("/tasks", task);
      const newTaskWithIndex = { ...res.data, originalIndex: tasks.length };
      setTasks([...tasks, newTaskWithIndex]);
      setShowModal(false);
      setNewTask({ title: "", datetime: "" });
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 relative min-h-screen bg-base-200">
      {/* Categories + Sorting + Export */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/category/${cat.key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryName === cat.key
                  ? "bg-primary text-white shadow-md"
                  : "bg-base-300 text-base-content hover:bg-base-100"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-3">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-base-300 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {sortingOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowExport(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md whitespace-nowrap"
          >
            Export / Share
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} setTasks={setTasks} />
          ))}
        </div>
      ) : (
        <TaskTemplateCard />
      )}

      {/* Add Task Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <FaPlus className="w-5 h-5" />
      </button>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <form
            onSubmit={handleAddTask}
            className="bg-base-100 p-6 rounded-2xl shadow-xl w-80"
          >
            <h2 className="text-xl font-bold mb-4 text-center text-primary">
              Add New Task
            </h2>

            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-base-200 border border-base-300 mb-3"
              placeholder="Enter task title"
              required
            />

            <label className="block text-sm font-medium mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={normalizeDateTime(newTask.datetime)}
              onChange={(e) =>
                setNewTask({ ...newTask, datetime: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-base-200 border border-base-300 mb-4"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={adding}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
              >
                {adding && <span className="loading loading-spinner"></span>}
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Export Preview Modal */}
      {showExport && (
        <ExportPreview
          tasks={filteredTasks}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

export default CategoryPage;
