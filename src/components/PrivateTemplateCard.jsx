import React from "react";
import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const PrivateTemplateCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <div
      className="relative flex flex-col items-center justify-center 
      bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 
      border border-base-300 dark:border-base-200 rounded-2xl shadow-xl 
      px-10 py-12 hover:shadow-2xl hover:shadow-primary/20 
      transition-all duration-500"
    >
      {/* Centered Lock Icon with smooth rotation */}
      <motion.div
        className="flex items-center justify-center mb-5"
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <FaLock className="text-6xl text-primary drop-shadow-md" />
      </motion.div>

      {/* Text content */}
      <h2 className="text-2xl font-bold mb-3 text-base-content/80">
        No Private Tasks Yet
      </h2>
      <p className="text-sm text-base-content/60 max-w-xs mx-auto">
        Your secrets are safe here — add your first private task 🔒
      </p>

      {/* Soft hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 blur-lg transition duration-500 pointer-events-none"></div>
    </div>
  </motion.div>
);

export default PrivateTemplateCard;
