import React from "react";
import { FaClipboardList } from "react-icons/fa";

const TaskTemplateCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-base-content/60">
      <FaClipboardList className="text-6xl mb-4 text-primary/70" />
      <h2 className="text-xl font-semibold mb-2">No Tasks Yet</h2>
      <p className="text-sm">Start organizing your day — create your first task now!</p>
    </div>
  );
};

export default TaskTemplateCard;
