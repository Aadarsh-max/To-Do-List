import React, { useState, useEffect } from "react";
import API from "../services/api";
import { auth } from "../firebase/config";
import {
  Lock,
  Unlock,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
} from "lucide-react";
import PrivateTaskCard from "../components/PrivateTaskCard";
import PrivateTemplateCard from "../components/PrivateTemplateCard";
import { normalizeDateTime } from "../utils/dateTimeUtil.js";

const PrivateTasks = () => {
  const [pin, setPin] = useState("");
  const [pinSet, setPinSet] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(""); // ⬅️ merged datetime
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);

  const firebaseUID = auth.currentUser?.uid;

  useEffect(() => {
    if (firebaseUID) checkIfPinSet();
  }, [firebaseUID]);

  const checkIfPinSet = async () => {
    try {
      const res = await API.get(
        `/private-tasks/check-pin?firebaseUID=${firebaseUID}`
      );
      setPinSet(res.data.pinSet);
    } catch {
      setPinSet(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async () => {
    if (pin.length !== 4) return alert("PIN must be 4 digits");
    try {
      await API.post("/private-tasks/set-pin", { firebaseUID, pin });
      alert("PIN set successfully!");
      setPinSet(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error setting PIN");
    }
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 4) return alert("Enter valid 4-digit PIN");
    try {
      await API.post("/private-tasks/verify-pin", { firebaseUID, pin });
      setIsVerified(true);
      fetchPrivateTasks();
    } catch {
      alert("Invalid PIN!");
    }
  };

  const fetchPrivateTasks = async () => {
    try {
      const res = await API.get(`/private-tasks?firebaseUID=${firebaseUID}`);
      setTasks(res.data);
    } catch {
      console.log("Error fetching private tasks");
    }
  };

 const addTask = async () => {
  if (!title.trim()) return alert("Task title required!");

  const normalizedDT = normalizeDateTime(dateTime);
  if (!normalizedDT) return alert("Invalid date & time format");

  try {
    const res = await API.post("/private-tasks", {
      title,
      description,
      dateTime: normalizedDT,
      firebaseUID,
    });

    setTasks((prev) => [res.data, ...prev]);
    setTitle("");
    setDescription("");
    setDateTime("");
  } catch {
    alert("Error adding task");
  }
};


  const deleteTask = async (id) => {
    try {
      await API.delete(`/private-tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      console.log("Error deleting task");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await API.patch(`/private-tasks/${id}/toggle`);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log("Error toggling completion:", err);
    }
  };

  // Authentication
  if (!firebaseUID)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="card glass shadow-2xl p-10 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-2">Authentication Required</h2>
          <p className="text-base-content/70">
            Please login to access your private tasks.
          </p>
        </div>
      </div>
    );

  // Loading Spinner
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-primary/10 to-accent/10">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
        <p className="text-base-content/70 font-medium">
          Loading secure space...
        </p>
      </div>
    );

  // Main Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 px-4">
      {!pinSet ? (
        // PIN SET UI
        <div className="w-full max-w-md mx-auto">
          <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-lg transition-transform hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-center text-white">
              <KeyRound className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Set Your Secure PIN</h2>
              <p className="opacity-90 mt-1">
                Create a 4-digit PIN to protect your private tasks
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="input input-bordered w-full text-center text-2xl tracking-[1em] font-semibold"
                  placeholder="••••"
                />
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary"
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                onClick={handleSetPin}
                className="btn btn-primary w-full rounded-xl text-white font-semibold"
              >
                <Lock className="w-5 h-5 mr-2" />
                Set PIN
              </button>
            </div>
          </div>
        </div>
      ) : !isVerified ? (
        // PIN VERIFY UI
        <div className="w-full max-w-md mx-auto">
          <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-lg transition-transform hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-success to-emerald-500 p-6 text-center text-white">
              <Unlock className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Enter Your PIN</h2>
              <p className="opacity-90 mt-1">
                Access your private vault securely
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="input input-bordered w-full text-center text-2xl tracking-[1em] font-semibold"
                  placeholder="••••"
                />
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-success"
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                onClick={handleVerifyPin}
                className="btn btn-success w-full rounded-xl text-white font-semibold"
              >
                <Unlock className="w-5 h-5 mr-2" />
                Unlock
              </button>
            </div>
          </div>
        </div>
      ) : (
        // MAIN PRIVATE TASKS PAGE
        <div className="w-full max-w-5xl mx-auto">
          <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="bg-gradient-to-r from-indigo-600 via-primary to-secondary p-8 text-center text-white">
              <Shield className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Your Private Vault</h2>
              <p className="opacity-90">Secure tasks only you can see</p>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl mb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <label className="text-sm font-medium text-base-content">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={normalizeDateTime(dateTime)}
                    onChange={(e) =>
                      setDateTime(normalizeDateTime(e.target.value))
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={addTask}
                  className="btn btn-primary mt-4 rounded-xl w-full md:w-auto flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <PrivateTaskCard
                      key={task._id}
                      task={task}
                      onDelete={deleteTask}
                      onToggleComplete={toggleComplete}
                    />
                  ))
                ) : (
                  <PrivateTemplateCard />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateTasks;
