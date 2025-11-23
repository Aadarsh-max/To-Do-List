import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsGraph = ({ tasks }) => {
  const stats = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        labels: [],
        completedData: [],
        incompleteData: [],
        totalCompleted: 0,
        totalIncomplete: 0,
        dateRange: null,
      };
    }

    // Get all dates and sort them
    const dates = tasks
      .map((task) => new Date(task.datetime || task.date))
      .filter((date) => !isNaN(date.getTime()))
      .sort((a, b) => a - b);

    if (dates.length === 0) {
      return {
        labels: [],
        completedData: [],
        incompleteData: [],
        totalCompleted: 0,
        totalIncomplete: 0,
        dateRange: null,
      };
    }

    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    const daysDiff = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

    // Group by individual dates if range > 7 days, otherwise by day of week
    const groupByDate = daysDiff > 7;

    if (groupByDate) {
      // Group by actual dates
      const dateMap = {};

      tasks.forEach((task) => {
        const date = new Date(task.datetime || task.date);
        if (isNaN(date.getTime())) return;

        const dateKey = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== new Date().getFullYear()
              ? "numeric"
              : undefined,
        });

        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { completed: 0, incomplete: 0, sortDate: date };
        }

        if (task.completed) {
          dateMap[dateKey].completed++;
        } else {
          dateMap[dateKey].incomplete++;
        }
      });

      // Sort by date
      const sortedEntries = Object.entries(dateMap).sort(
        ([, a], [, b]) => a.sortDate - b.sortDate
      );

      return {
        labels: sortedEntries.map(([label]) => label),
        completedData: sortedEntries.map(([, data]) => data.completed),
        incompleteData: sortedEntries.map(([, data]) => data.incomplete),
        totalCompleted: sortedEntries.reduce(
          (sum, [, data]) => sum + data.completed,
          0
        ),
        totalIncomplete: sortedEntries.reduce(
          (sum, [, data]) => sum + data.incomplete,
          0
        ),
        dateRange: `${minDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${maxDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
      };
    } else {
      // Group by day of week
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayData = daysOfWeek.map(() => ({ completed: 0, incomplete: 0 }));

      tasks.forEach((task) => {
        const date = new Date(task.datetime || task.date);
        if (isNaN(date.getTime())) return;

        const dayIndex = date.getDay();

        if (task.completed) {
          dayData[dayIndex].completed++;
        } else {
          dayData[dayIndex].incomplete++;
        }
      });

      return {
        labels: daysOfWeek,
        completedData: dayData.map((d) => d.completed),
        incompleteData: dayData.map((d) => d.incomplete),
        totalCompleted: dayData.reduce((sum, d) => sum + d.completed, 0),
        totalIncomplete: dayData.reduce((sum, d) => sum + d.incomplete, 0),
        dateRange:
          daysDiff === 0
            ? minDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : `${minDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} - ${maxDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`,
      };
    }
  }, [tasks]);

  const chartData = {
    labels: stats.labels,
    datasets: [
      {
        label: "Completed",
        data: stats.completedData,
        backgroundColor: "rgb(34, 197, 94)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Incomplete",
        data: stats.incompleteData,
        backgroundColor: "rgb(239, 68, 68)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 15,
          font: {
            size: 11,
            weight: 600,
          },
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (sum, item) => sum + item.parsed.y,
              0
            );
            return `Total: ${total} tasks`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            weight: 500,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const completionRate =
    stats.totalCompleted + stats.totalIncomplete > 0
      ? Math.round(
          (stats.totalCompleted /
            (stats.totalCompleted + stats.totalIncomplete)) *
            100
        )
      : 0;

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl rounded-2xl sm:rounded-3xl">
        <div className="card-body p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30" />
            <p className="text-base sm:text-lg opacity-60">
              No tasks to display
            </p>
            <p className="text-xs sm:text-sm opacity-40 mt-2">
              Add some tasks to see statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
      <div className="card-body p-0">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 border-b border-base-300">
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                <span>Task Statistics</span>
              </h2>
              {stats.dateRange && (
                <p className="text-xs sm:text-sm opacity-70 mt-1 ml-7 sm:ml-9 lg:ml-10">
                  {stats.dateRange}
                </p>
              )}
            </div>
            <div className="badge badge-md sm:badge-lg badge-primary font-semibold px-3 sm:px-4 py-3 sm:py-4">
              {completionRate}% Complete
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="stat bg-success/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-success/20">
            <div className="stat-figure text-success">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="stat-title text-xs opacity-70">Completed</div>
            <div className="stat-value text-success text-2xl sm:text-3xl">
              {stats.totalCompleted}
            </div>
          </div>

          <div className="stat bg-error/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-error/20">
            <div className="stat-figure text-error">
              <XCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="stat-title text-xs opacity-70">Incomplete</div>
            <div className="stat-value text-error text-2xl sm:text-3xl">
              {stats.totalIncomplete}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="bg-base-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner">
            <div className="h-64 sm:h-80 lg:h-96">
              <Bar data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGraph;
