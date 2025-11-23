import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaStar, FaRegStar } from "react-icons/fa";
import confetti from "canvas-confetti";
import API from "../services/api";
import { normalizeDateTime } from "../utils/dateTimeUtil";

const TaskCard = ({ task, setTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    datetime: task.datetime,
    category: task.category,
  });
  const sortTasks = (tasksArray) => {
    return [...tasksArray].sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return a.originalIndex - b.originalIndex; // original order
    });
  };
  const toggleStar = async () => {
    try {
      await API.put(`/tasks/${task._id}`, { starred: !task.starred });

      setTasks((prev) => {
        // Update the task
        const updatedTasks = prev.map((t) =>
          t._id === task._id ? { ...t, starred: !t.starred } : t
        );

        // Sort: starred first, others keep their original order
        const starred = updatedTasks.filter((t) => t.starred);
        const unstarred = updatedTasks.filter((t) => !t.starred);

        return [...starred, ...unstarred];
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle completed
  const toggleComplete = async () => {
    try {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: !t.completed } : t
        )
      );
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      if (!task.completed) {
        confetti({
          particleCount: 150,
          spread: 90,
          startVelocity: 45,
          origin: { y: 0.6 },
          zIndex: 9999,
          colors: ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff"],
        });
        setToastMessage({ type: "success", text: "Task completed!" });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }
    } catch (err) {
      console.error(err);
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: task.completed } : t
        )
      );
    }
  };
  // Edit submit
  const handleEditSubmit = async () => {
    if (!editedTask.title.trim()) return;
    try {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, ...editedTask } : t))
      );
      await API.put(`/tasks/${task._id}`, editedTask);
      setIsEditing(false);
      setToastMessage({ type: "success", text: "Task updated!" });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };
  // Delete
  const handleDeleteConfirm = async () => {
    try {
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      await API.delete(`/tasks/${task._id}`);
      setConfirmDelete(false);
      setToastMessage({ type: "error", text: "Task deleted!" });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };
  const getCategoryColor = (category) => {
    const colors = {
      work: "bg-primary/10 text-primary border-primary/20",
      personal: "bg-secondary/10 text-secondary border-secondary/20",
      wishlist: "bg-accent/10 text-accent border-accent/20",
      birthdays: "bg-warning/10 text-warning border-warning/20",
      special: "bg-success/10 text-success border-success/20",
    };
    return (
      colors[category] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
    );
  };
  const getCategoryEmoji = (category) => {
    const emojis = {
      work: "💼",
      personal: "👤",
      wishlist: "🎁",
      birthdays: "🎂",
      special: "⭐",
    };
    return emojis[category] || "📌";
  };
  return (
    <>
      <div
        className={`group relative p-5 bg-base-100 rounded-2xl border-2 transition-all duration-300 ${
          task.completed
            ? "border-success/30 bg-success/5"
            : "border-base-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
        }`}
      >
        {task.completed && (
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-success/10 to-success/5 rounded-2xl animate-pulse"></div>
        )}

        <div className="relative flex justify-between items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleComplete}
                className="checkbox checkbox-success checkbox-lg transition-transform hover:scale-110"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-bold mb-2 transition-all duration-300 ${
                  task.completed
                    ? "line-through text-base-content/40"
                    : "text-base-content group-hover:text-primary"
                }`}
              >
                {task.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                    task.category
                  )}`}
                >
                  <span>{getCategoryEmoji(task.category)}</span>
                  <span className="capitalize">{task.category}</span>
                </span>
              </div>

              {task.datetime && (
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <span>
                    {new Date(task.datetime).toLocaleString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleStar}
              className={`btn btn-ghost btn-sm btn-circle transition-all hover:scale-110 ${
                task.starred ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {task.starred ? <FaStar /> : <FaRegStar />}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-ghost btn-sm btn-circle text-info hover:bg-info/20 transition-all hover:scale-110"
            >
              <FaEdit className="text-base" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20 transition-all hover:scale-110"
            >
              <FaTrashAlt className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {showToast && toastMessage && (
        <div className="toast toast-top toast-end z-[9999]">
          <div
            className={`alert ${
              toastMessage.type === "success" ? "alert-success" : "alert-error"
            } shadow-2xl border-2 ${
              toastMessage.type === "success"
                ? "border-success/50"
                : "border-error/50"
            } animate-bounce`}
          >
            <div className="flex flex-col gap-1">
              <div className="font-bold text-base">
                {toastMessage.type === "success" ? "Amazing!" : "Notice"}
              </div>
              <div className="text-sm opacity-90">{toastMessage.text}</div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[10000] animate-fadeIn"
          onClick={() => setIsEditing(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-base-100 p-8 rounded-3xl shadow-2xl w-96 relative z-[10001] border-2 border-primary/20 animate-scaleIn"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>

            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="input input-bordered w-full mb-3"
              placeholder="Task Title"
            />
            <input
              type="datetime-local"
              value={normalizeDateTime(editedTask.datetime)}
              onChange={(e) =>
                setEditedTask({ ...editedTask, datetime: e.target.value })
              }
              className="input input-bordered w-full mb-3"
            />

            <select
              value={editedTask.category}
              onChange={(e) =>
                setEditedTask({ ...editedTask, category: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="work">💼 Work</option>
              <option value="personal">👤 Personal</option>
              <option value="wishlist">🎁 Wishlist</option>
              <option value="birthdays">🎂 Birthdays</option>
              <option value="special">⭐ Special</option>
            </select>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="btn btn-primary flex-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[10000] animate-fadeIn">
          <div className="bg-base-100 p-6 rounded-2xl w-80 shadow-xl border border-error/30 animate-scaleIn">
            <h3 className="text-lg font-bold text-error mb-4 text-center">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                className="btn btn-ghost rounded-xl"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error rounded-xl text-white"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
