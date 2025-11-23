import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// PDF Document Component
const TasksPDFDocument = ({ tasks, template }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      backgroundColor: template === "dark" ? "#1a1a1a" : "#ffffff",
      fontFamily: "Helvetica",
    },
    header: {
      marginBottom: 30,
      textAlign: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color:
        template === "dark"
          ? "#60a5fa"
          : template === "modern"
          ? "#9333ea"
          : template === "sunset"
          ? "#ea580c"
          : template === "ocean"
          ? "#0891b2"
          : template === "forest"
          ? "#059669"
          : template === "candy"
          ? "#ec4899"
          : template === "retro"
          ? "#f59e0b"
          : "#4f46e5",
      marginBottom: 10,
    },
    date: {
      fontSize: 10,
      color: template === "dark" ? "#d1d5db" : "#6b7280",
      marginBottom: 5,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
      gap: 10,
    },
    statBox: {
      flex: 1,
      padding: 15,
      backgroundColor: template === "dark" ? "#374151" : "#f9fafb",
      borderRadius: 8,
      border: `1px solid ${template === "dark" ? "#4b5563" : "#e5e7eb"}`,
      textAlign: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color:
        template === "dark"
          ? "#60a5fa"
          : template === "modern"
          ? "#9333ea"
          : template === "sunset"
          ? "#ea580c"
          : template === "ocean"
          ? "#0891b2"
          : template === "forest"
          ? "#059669"
          : template === "candy"
          ? "#ec4899"
          : template === "retro"
          ? "#f59e0b"
          : "#4f46e5",
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 9,
      color: template === "dark" ? "#d1d5db" : "#6b7280",
    },
    taskContainer: {
      marginBottom: 12,
      padding: 15,
      backgroundColor: template === "dark" ? "#374151" : "#f9fafb",
      borderRadius: 8,
      border: `1px solid ${template === "dark" ? "#4b5563" : "#e5e7eb"}`,
    },
    taskHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    taskLeftSection: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
      marginRight: 10,
    },
    checkbox: {
      width: 12,
      height: 12,
      borderWidth: 1.4,
      borderRadius: 2,
      marginRight: 8,
      marginTop: 2,
      flexShrink: 0,
    },
    taskTitleContainer: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: template === "dark" ? "#f3f4f6" : "#111827",
      lineHeight: 1.4,
    },
    taskTitleCompleted: {
      textDecoration: "line-through",
      opacity: 0.6,
    },
    taskDateTime: {
      fontSize: 8,
      color: template === "dark" ? "#d1d5db" : "#6b7280",
      marginTop: 2,
      flexShrink: 0,
    },
    taskDescription: {
      fontSize: 10,
      color: template === "dark" ? "#d1d5db" : "#6b7280",
      marginTop: 8,
      marginLeft: 20,
      lineHeight: 1.5,
    },
    emptyState: {
      textAlign: "center",
      padding: 40,
      color: template === "dark" ? "#9ca3af" : "#6b7280",
      fontSize: 12,
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 50,
      right: 50,
      textAlign: "center",
      fontSize: 8,
      color: template === "dark" ? "#9ca3af" : "#9ca3af",
      borderTop: `1px solid ${template === "dark" ? "#4b5563" : "#e5e7eb"}`,
      paddingTop: 10,
    },
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Task Summary</Text>
          <Text style={styles.date}>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <View key={index} style={styles.taskContainer}>
              <View style={styles.taskHeader}>
                <View style={styles.taskLeftSection}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor:
                          template === "dark" ? "#9ca3af" : "#4b5563",
                        backgroundColor: task.completed
                          ? template === "dark"
                            ? "#60a5fa"
                            : "#4f46e5"
                          : "transparent",
                      },
                    ]}
                  />
                  <View style={styles.taskTitleContainer}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                  </View>
                </View>
                {task.datetime && (
                  <Text style={styles.taskDateTime}>
                    {new Date(task.datetime).toLocaleDateString()}
                  </Text>
                )}
              </View>
              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>No tasks found</Text>
        )}

        <View style={styles.footer}>
          <Text>Generated with Task Manager</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
const ExportPreview = ({ tasks = [], onClose }) => {
  const [template, setTemplate] = useState("elegant");

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Sharing not supported on this device");
      return;
    }
    try {
      await navigator.share({
        title: "My Tasks",
        text: tasks.map((t) => `• ${t.title}`).join("\n"),
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };
  const templates = {
    elegant: {
      bg: "from-blue-50 to-indigo-50",
      text: "text-gray-800",
      accent: "text-indigo-600",
      border: "border-indigo-200",
      card: "bg-white/80",
    },
    minimal: {
      bg: "from-gray-50 to-gray-100",
      text: "text-gray-900",
      accent: "text-gray-700",
      border: "border-gray-200",
      card: "bg-white",
    },
    dark: {
      bg: "from-gray-900 to-gray-800",
      text: "text-gray-100",
      accent: "text-blue-400",
      border: "border-gray-700",
      card: "bg-gray-800/50",
    },
    modern: {
      bg: "from-purple-50 via-pink-50 to-orange-50",
      text: "text-gray-800",
      accent: "text-purple-600",
      border: "border-purple-200",
      card: "bg-white/70",
    },
    sunset: {
      bg: "from-orange-50 via-pink-50 to-rose-50",
      text: "text-gray-800",
      accent: "text-orange-600",
      border: "border-orange-200",
      card: "bg-white/75",
    },
    ocean: {
      bg: "from-cyan-50 via-blue-50 to-indigo-50",
      text: "text-gray-800",
      accent: "text-cyan-600",
      border: "border-cyan-200",
      card: "bg-white/80",
    },
    forest: {
      bg: "from-emerald-50 via-green-50 to-teal-50",
      text: "text-gray-800",
      accent: "text-emerald-600",
      border: "border-emerald-200",
      card: "bg-white/80",
    },
    candy: {
      bg: "from-pink-50 via-fuchsia-50 to-cyan-50",
      text: "text-gray-800",
      accent: "text-pink-600",
      border: "border-pink-200",
      card: "bg-white/75",
    },
    retro: {
      bg: "from-yellow-50 via-amber-50 to-orange-50",
      text: "text-gray-800",
      accent: "text-amber-600",
      border: "border-amber-200",
      card: "bg-white/80",
    },
  };

  const currentTemplate = templates[template];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Export Tasks</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {Object.keys(templates).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${
                  template === t
                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>

            <PDFDownloadLink
              document={<TasksPDFDocument tasks={tasks} template={template} />}
              fileName={`tasks-${new Date().toISOString().split("T")[0]}.pdf`}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {({ loading }) => (
                <>
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download PDF
                    </>
                  )}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div
              className={`bg-gradient-to-br ${currentTemplate.bg} ${currentTemplate.text} rounded-2xl shadow-xl p-16`}
            >
              <div className="mb-12 text-center">
                <div className={`inline-block ${currentTemplate.accent} mb-4`}>
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h1
                  className={`text-5xl font-bold mb-3 ${currentTemplate.accent}`}
                >
                  Task Summary
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm opacity-70">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-12">
                <div
                  className={`${currentTemplate.card} ${currentTemplate.border} border rounded-xl p-4 text-center backdrop-blur-sm`}
                >
                  <div
                    className={`text-3xl font-bold ${currentTemplate.accent}`}
                  >
                    {tasks.length}
                  </div>
                  <div className="text-sm opacity-70 mt-1">Total Tasks</div>
                </div>
                <div
                  className={`${currentTemplate.card} ${currentTemplate.border} border rounded-xl p-4 text-center backdrop-blur-sm`}
                >
                  <div
                    className={`text-3xl font-bold ${currentTemplate.accent}`}
                  >
                    {tasks.filter((t) => t.completed).length}
                  </div>
                  <div className="text-sm opacity-70 mt-1">Completed</div>
                </div>
                <div
                  className={`${currentTemplate.card} ${currentTemplate.border} border rounded-xl p-4 text-center backdrop-blur-sm`}
                >
                  <div
                    className={`text-3xl font-bold ${currentTemplate.accent}`}
                  >
                    {tasks.filter((t) => !t.completed).length}
                  </div>
                  <div className="text-sm opacity-70 mt-1">Pending</div>
                </div>
              </div>

              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <div
                      key={i}
                      className={`${currentTemplate.card} ${currentTemplate.border} border rounded-xl p-5 backdrop-blur-sm transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 ${
                              currentTemplate.border
                            } flex items-center justify-center ${
                              task.completed ? currentTemplate.accent : ""
                            }`}
                          >
                            {task.completed && (
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium text-base ${
                                task.completed ? "opacity-60 line-through" : ""
                              }`}
                            >
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm opacity-60 mt-1">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {task.datetime && (
                          <div className="text-xs opacity-60 whitespace-nowrap flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
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
                            {new Date(task.datetime).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 opacity-50">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-lg">No tasks found</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t opacity-50 text-center text-sm">
                <p>Generated with Task Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPreview;
