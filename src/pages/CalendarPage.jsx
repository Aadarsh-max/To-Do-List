import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { auth } from "../firebase/config";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskTemplateCard from "../components/TaskTemplateCard";
import { FaPlus } from "react-icons/fa";
import { normalizeDateTime } from "../utils/dateTimeUtil.js"; // <-- FIX ADDED

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    datetime: "",
    category: "personal",
    repeat: "none",
  });
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "Work", key: "work" },
    { name: "Personal", key: "personal" },
    { name: "Wishlist", key: "wishlist" },
    { name: "Birthdays", key: "birthdays" },
    { name: "Special", key: "special" },
  ];

  const getLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTasks(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid) => {
    try {
      const res = await API.get(`/tasks?uid=${uid}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search listener
  useEffect(() => {
    const handleSearch = (e) => setSearchTerm(e.detail.toLowerCase());
    window.addEventListener("taskSearch", handleSearch);
    return () => window.removeEventListener("taskSearch", handleSearch);
  }, []);

  // Filter tasks by selected date
  useEffect(() => {
    const selectedStr = getLocalDateString(selectedDate);

    let filtered = tasks.filter((t) => {
      if (!t.datetime) return false;
      return normalizeDateTime(t.datetime).split("T")[0] === selectedStr;
    });

    if (searchTerm.trim()) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().startsWith(searchTerm)
      );
    }

    setFilteredTasks(filtered);
  }, [selectedDate, tasks, searchTerm]);

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return alert("Please log in to add tasks");
    if (!newTask.title.trim()) return;

    setAddingTask(true);

    const date = getLocalDateString(selectedDate);
    const time = newTask.datetime.split("T")[1] || "12:00";
    const dateTimeLocal = `${date}T${time}`;

    const taskBase = {
      title: newTask.title.trim(),
      category: newTask.category,
      completed: false,
      firebaseUID: currentUser.uid,
      repeat: newTask.repeat,
    };

    try {
      const repeatCount = Number(newTask.repeat) || 0;
      for (let i = 0; i <= repeatCount; i++) {
        const d = new Date(dateTimeLocal);
        d.setDate(d.getDate() + i);

        await API.post("/tasks", {
          ...taskBase,
          datetime: normalizeDateTime(d), // <-- FIX: NO UTC SHIFT
        });
      }

      await fetchTasks(currentUser.uid);
      setShowModal(false);
      setNewTask({
        title: "",
        datetime: "",
        category: "personal",
        repeat: "none",
      });
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setAddingTask(false);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = getLocalDateString(date);
    const hasTask = tasks.some(
      (t) => normalizeDateTime(t.datetime).split("T")[0] === dateStr
    );
    return hasTask ? (
      <div className="flex justify-center mt-1">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
      </div>
    ) : null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-primary">
          Task Calendar
        </h1>

        <div className="rounded-3xl shadow-xl p-6 mb-8 border border-base-300 flex justify-center bg-white text-gray-900">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>

        <h2 className="text-xl font-bold mb-4 text-center text-base-content">
          Tasks on{" "}
          <span className="text-primary">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </h2>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-white p-5 rounded-full shadow-xl hover:scale-110 transition-all"
        >
          <FaPlus className="w-6 h-6" />
        </button>

        {/* Add Task Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
            onClick={() => !addingTask && setShowModal(false)}
          >
            <form
              onSubmit={handleAddTask}
              onClick={(e) => e.stopPropagation()}
              className="bg-base-100 p-8 rounded-3xl shadow-2xl w-96 border border-primary/30 animate-fade"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Add Task for {selectedDate.toDateString()}
              </h2>

              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="input input-bordered w-full mb-4"
                required
              />

              <label className="font-semibold text-sm mb-1 block">
                Select Time
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="time"
                  className="input input-bordered flex-1"
                  value={newTask.datetime.split("T")[1] || ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      datetime: `${getLocalDateString(selectedDate)}T${
                        e.target.value
                      }`,
                    })
                  }
                />
              </div>

              <select
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className="select select-bordered w-full mb-4"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={newTask.repeat}
                onChange={(e) =>
                  setNewTask({ ...newTask, repeat: e.target.value })
                }
                className="select select-bordered w-full mb-6"
              >
                <option value="none">No Repeat</option>
                <option value="3">Repeat 3 Days</option>
                <option value="7">Repeat 7 Days</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={addingTask}
                  onClick={() => setShowModal(false)}
                  className="btn flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingTask}
                  className="btn btn-primary flex-1"
                >
                  {addingTask ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Add Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
