import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="card bg-base-100 p-6 sm:p-8 shadow-2xl rounded-2xl sm:rounded-3xl text-center border border-base-300">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-base-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-base sm:text-lg font-medium text-base-content/60">
            No task data available
          </p>
          <p className="text-xs sm:text-sm text-base-content/40">
            Create your first task to see statistics
          </p>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const totalTasks = tasks.length;
  const starredCount = tasks.filter((t) => t.starred).length;

  const categories = ["work", "personal", "wishlist", "birthdays", "special"];
  const categoryData = categories.map(
    (cat) => tasks.filter((t) => t.category === cat).length
  );

  const mainPieData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Completion",
        data: [completedCount, pendingCount],
        backgroundColor: ["rgba(34, 197, 94, 0.9)", "rgba(239, 68, 68, 0.9)"],
        borderColor: ["rgb(21, 128, 61)", "rgb(185, 28, 28)"],
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const categoryPieData = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        label: "Tasks by Category",
        data: categoryData,
        backgroundColor: [
          "rgba(239, 68, 68, 0.9)",
          "rgba(59, 130, 246, 0.9)",
          "rgba(34, 197, 94, 0.9)",
          "rgba(251, 191, 36, 0.9)",
          "rgba(139, 92, 246, 0.9)",
        ],
        borderColor: [
          "rgb(185, 28, 28)",
          "rgb(37, 99, 235)",
          "rgb(21, 128, 61)",
          "rgb(245, 158, 11)",
          "rgb(109, 40, 217)",
        ],
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            size: 11,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  const completionPercentage = ((completedCount / totalTasks) * 100).toFixed(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
              <div className="bg-primary/20 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-base-content/60">
                  Total Tasks
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {totalTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
              <div className="bg-success/20 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-base-content/60">
                  Completed
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="card bg-gradient-to-br from-error/10 to-error/5 border border-error/20 shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
              <div className="bg-error/20 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-base-content/60">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-error">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ Starred */}
        <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
              <div className="bg-warning/20 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-warning fill-warning"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848 1.417 8.269L12 19.771l-7.417 4.094L6 15.596 0 9.748l8.332-1.593z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-base-content/60">
                  Starred
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-warning">
                  {starredCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card bg-base-100 shadow-2xl border border-base-300 hover:shadow-3xl transition-shadow duration-300">
          <div className="card-body p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary flex items-center gap-2 sm:gap-3">
                <span className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"
                    />
                  </svg>
                </span>
                <span className="text-base sm:text-lg lg:text-xl">
                  Completion Status
                </span>
              </h2>
              <div className="badge badge-primary badge-sm sm:badge-md lg:badge-lg font-semibold">
                {completionPercentage}%
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto">
              <Pie data={mainPieData} options={options} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl border border-base-300 hover:shadow-3xl transition-shadow duration-300">
          <div className="card-body p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary flex items-center gap-2 sm:gap-3">
                <span className="bg-secondary/10 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </span>
                <span className="text-base sm:text-lg lg:text-xl">
                  Category Breakdown
                </span>
              </h2>
              <div className="badge badge-secondary badge-sm sm:badge-md lg:badge-lg font-semibold">
                {categories.length} Types
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto">
              <Pie data={categoryPieData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
