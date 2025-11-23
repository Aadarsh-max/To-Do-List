import React, { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import PageLoader from "../components/PageLoader";
import { auth } from "../firebase/config";
import { Star, Sparkles } from "lucide-react";
import ExportPreview from "../components/ExportPreview";

const StarredTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // sorting
  const [sortType, setSortType] = useState("Newest");
  const sortingOptions = [
    "Newest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Completed First",
    "Uncompleted First",
  ];

  // export
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchStarredTasks(currentUser.uid);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchStarredTasks = async (uid) => {
    try {
      const res = await API.get("/tasks", { params: { uid } });
      const starred = res.data.filter((task) => task.starred);
      setTasks(starred);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // search event from homepage
  useEffect(() => {
    const handleSearch = (e) => setSearchTerm(e.detail.toLowerCase());
    window.addEventListener("taskSearch", handleSearch);
    return () => window.removeEventListener("taskSearch", handleSearch);
  }, []);

  // search + sorting
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (searchTerm.trim()) {
      list = list.filter((t) => t.title.toLowerCase().startsWith(searchTerm));
    }

    // Sort logic
    return list.sort((a, b) => {
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
  }, [tasks, searchTerm, sortType]);

  if (loading) return <PageLoader message="Loading starred tasks..." />;
  if (!user) return <PageLoader message="Loading Profile..." />;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Star className="w-10 h-10 text-warning fill-warning" />
                <Sparkles className="w-5 h-5 text-warning absolute -top-1 -right-1" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-base-content">
                Starred Tasks
              </h1>
            </div>
            <p className="text-base-content/70 text-lg ml-1">
              Your most important tasks at a glance
            </p>
          </div>

          {/* Sorting + Export */}
          {filteredTasks.length > 0 && (
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md whitespace-nowrap"
              >
                Export / Share
              </button>
            </div>
          )}
        </div>

        {/* Counter Badge */}
        {filteredTasks.length > 0 && (
          <div className="badge badge-warning badge-lg gap-2 mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "starred task" : "starred tasks"}
            </span>
          </div>
        )}

        {/* Tasks */}
        {filteredTasks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} setTasks={setTasks} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-base-300 rounded-full flex items-center justify-center">
                <Star className="w-16 h-16 text-base-content/30" />
              </div>
              <Sparkles className="w-8 h-8 text-warning absolute top-0 right-0" />
            </div>
            <h3 className="text-2xl font-semibold text-base-content mb-2">
              No starred tasks found
            </h3>
            <p className="text-base-content/60 text-center max-w-md">
              Search didn't match anything — try another keyword
            </p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExport && (
        <ExportPreview
          tasks={filteredTasks}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

export default StarredTask;
