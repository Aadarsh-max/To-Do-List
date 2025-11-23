import React, { useState } from "react";
import { FaTrashAlt, FaLock, FaClock, FaCalendar } from "react-icons/fa";
import confetti from "canvas-confetti";

// ✨ DaisyUI Toast Utility
const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `alert ${
    type === "success"
      ? "alert-success"
      : type === "error"
      ? "alert-error"
      : "alert-info"
  } shadow-lg w-fit fixed bottom-5 right-5 animate-fade-in z-[9999] backdrop-blur-md bg-opacity-90`;
  toast.innerHTML = `
    <div>
      <span class="font-semibold text-sm">${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

const PrivateTaskCard = ({ task, onDelete, onToggleComplete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCheckboxChange = () => {
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#60a5fa", "#34d399"],
      });
      showToast("✅ Task completed successfully", "success");
    } else {
      showToast("🔄 Task marked incomplete", "info");
    }
    onToggleComplete(task._id);
  };

  const confirmDelete = () => {
    onDelete(task._id);
    showToast("🗑️ Task deleted successfully", "error");
    setShowConfirm(false);
  };

  // ⬇⬇ NEW — extract & format date & time from dateTime
  const extractDate = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const extractTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  const formattedDate = extractDate(task?.dateTime);
  const formattedTime = extractTime(task?.dateTime);
  // ⬆⬆ END changes

  return (
    <>
      <div
        className={`relative p-6 rounded-2xl transition-all duration-300 border backdrop-blur-lg
        ${
          task.completed
            ? "bg-success/10 border-success/40 text-success-content opacity-80 hover:shadow-success/30"
            : "bg-base-100/70 border-base-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
        } hover:-translate-y-1`}
      >
        <div
          className={`absolute top-4 right-4 transition-transform duration-300 ${
            task.completed ? "text-success" : "text-primary"
          } hover:rotate-12`}
        >
          <FaLock className="w-5 h-5" />
        </div>

        {/* Task Header */}
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-primary mt-1 scale-110 transition-transform duration-200 hover:scale-125"
          />

          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-all duration-300 ${
                task.completed
                  ? "line-through text-base-content/50"
                  : "text-base-content hover:text-primary"
              }`}
            >
              {task.title || "Untitled Task"}
            </h3>

            {task.description && (
              <p
                className={`mt-1 text-sm transition-all ${
                  task.completed
                    ? "text-base-content/40 line-through"
                    : "text-base-content/70"
                }`}
              >
                {task.description}
              </p>
            )}

            {(formattedDate || formattedTime) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {formattedDate && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm 
                    ${
                      task.completed
                        ? "bg-gradient-to-r from-green-200/30 to-green-500/20 text-success"
                        : "bg-gradient-to-r from-primary/20 to-secondary/10 text-primary"
                    }`}
                  >
                    <FaCalendar className="w-3 h-3" />
                    {formattedDate}
                  </div>
                )}

                {formattedTime && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm 
                    ${
                      task.completed
                        ? "bg-gradient-to-r from-green-200/30 to-green-500/20 text-success"
                        : "bg-gradient-to-r from-secondary/20 to-accent/10 text-secondary"
                    }`}
                  >
                    <FaClock className="w-3 h-3" />
                    {formattedTime}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 border-t border-base-200 pt-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="btn btn-error btn-sm text-white gap-2 rounded-full px-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <FaTrashAlt className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">
              Do you really want to delete this?
            </h3>
            <p className="py-2 text-sm opacity-80">
              This action cannot be undone.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-error text-white"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowConfirm(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default PrivateTaskCard;
