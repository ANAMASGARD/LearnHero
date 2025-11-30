"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedThemeToggle({ size = "default" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${size === "small" ? "w-12 h-6" : "w-16 h-8"} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse`} />
    );
  }

  const isDark = theme === "dark";
  const isSmall = size === "small";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative ${isSmall ? "w-12 h-6" : "w-16 h-8"} rounded-full p-1 cursor-pointer
        transition-colors duration-500 ease-in-out overflow-hidden
        ${isDark 
          ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800" 
          : "bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400"
        }
        shadow-lg hover:shadow-xl
        border-2 ${isDark ? "border-indigo-500/50" : "border-yellow-300/50"}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Stars (dark mode) */}
      <AnimatePresence>
        {isDark && [...Array(3)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: `${20 + i * 15}%`, left: `${15 + i * 20}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </AnimatePresence>

      {/* Clouds (light mode) */}
      <AnimatePresence>
        {!isDark && (
          <motion.div
            className="absolute top-1 left-1 w-3 h-2 bg-white/60 rounded-full"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Toggle Circle - Sun/Moon */}
      <motion.div
        className={`
          relative ${isSmall ? "w-4 h-4" : "w-6 h-6"} rounded-full
          flex items-center justify-center
          ${isDark 
            ? "bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300" 
            : "bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400"
          }
          shadow-md
        `}
        layout
        animate={{ x: isDark ? (isSmall ? 24 : 32) : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Sun rays */}
        <AnimatePresence>
          {!isDark && [...Array(8)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className={`absolute ${isSmall ? "w-0.5 h-1.5" : "w-0.5 h-2"} bg-yellow-500/70 rounded-full`}
              style={{ transform: `rotate(${i * 45}deg) translateY(${isSmall ? "-8px" : "-10px"})` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
            />
          ))}
        </AnimatePresence>

        {/* Moon craters */}
        <AnimatePresence>
          {isDark && (
            <>
              <motion.div
                className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full"
                style={{ top: "20%", left: "25%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-gray-300 rounded-full"
                style={{ bottom: "25%", right: "20%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

export default AnimatedThemeToggle;
