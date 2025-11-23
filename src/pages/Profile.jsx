import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import StatsGraph from "../components/StatsGraph";
import PieChart from "../components/PieChart";
import API from "../services/api.js";
import { Star } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }
      try {
        const res = await API.get(`/users/${currentUser.uid}`);
        const mergedUser = {
          ...res.data.user,
          name: currentUser.displayName || res.data.user.name || "No Name",
          email: currentUser.email || res.data.user.email,
        };
        setUser(mergedUser);
        setTasks(res.data.tasks || []);
      } catch {
        setUser({
          name: currentUser.displayName || "No Name",
          email: currentUser.email,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg px-4">
        Loading profile...
      </div>
    );

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const starredTasks = tasks.filter((t) => t.starred);

  const userInitial =
    user.name && user.name.trim().length > 0
      ? user.name.trim()[0].toUpperCase()
      : "U";

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        {/* User Info Card */}
        <div className="card bg-base-100 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary flex-shrink-0">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {userInitial}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left w-full min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 truncate">
                {user.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <button
              className="btn btn-error text-white btn-sm w-full sm:w-auto sm:btn-md mt-2 sm:mt-0"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6 sm:space-y-8">
          <div className="w-full">
            <div className="card bg-base-100 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <PieChart tasks={tasks} />
            </div>
          </div>
          <div className="w-full">
            <div className="card bg-base-100 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <StatsGraph tasks={tasks} />
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Tasks */}
          <div className="card bg-base-100 p-4 sm:p-6 shadow-xl rounded-2xl sm:rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-error">
              Pending Tasks ({pendingTasks.length})
            </h3>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-2 sm:space-y-3">
                {pendingTasks.map((t) => (
                  <li
                    key={t._id}
                    className="p-2 sm:p-3 bg-base-200 rounded-lg sm:rounded-xl flex justify-between items-center gap-2 min-w-0"
                  >
                    <span className="truncate flex-1 text-sm sm:text-base">
                      {t.title}
                    </span>
                    <span className="text-xs text-gray-500 capitalize flex-shrink-0">
                      {t.category}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">
                No pending tasks 🎉
              </p>
            )}
          </div>

          {/* Completed Tasks */}
          <div className="card bg-base-100 p-4 sm:p-6 shadow-xl rounded-2xl sm:rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-success">
              Completed Tasks ({completedTasks.length})
            </h3>
            {completedTasks.length > 0 ? (
              <ul className="space-y-2 sm:space-y-3">
                {completedTasks.map((t) => (
                  <li
                    key={t._id}
                    className="p-2 sm:p-3 bg-base-200 rounded-lg sm:rounded-xl flex justify-between items-center gap-2 min-w-0"
                  >
                    <span className="line-through opacity-70 truncate flex-1 text-sm sm:text-base">
                      {t.title}
                    </span>
                    <span className="text-xs text-gray-500 capitalize flex-shrink-0">
                      {t.category}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">
                No completed tasks yet.
              </p>
            )}
          </div>

          {/* Starred Tasks */}
          <div className="card bg-base-100 p-4 sm:p-6 shadow-xl rounded-2xl sm:rounded-3xl md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-warning fill-warning" />
              <h3 className="text-lg sm:text-xl font-bold text-warning">
                Starred Tasks ({starredTasks.length})
              </h3>
            </div>
            {starredTasks.length > 0 ? (
              <ul className="space-y-2 sm:space-y-3">
                {starredTasks.map((t) => (
                  <li
                    key={t._id}
                    className="p-2 sm:p-3 bg-base-200 rounded-lg sm:rounded-xl flex justify-between items-center gap-2 min-w-0"
                  >
                    <span className="font-medium truncate flex-1 text-sm sm:text-base">
                      {t.title}
                    </span>
                    <span className="text-xs text-gray-500 capitalize flex-shrink-0">
                      {t.category}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">
                No starred tasks yet ⭐
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm mx-4">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action flex-col sm:flex-row gap-2">
              <button
                className="btn btn-error text-white w-full sm:w-auto"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
              <button
                className="btn w-full sm:w-auto"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Profile;
