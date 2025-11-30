"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative w-14 h-14 rounded-full cursor-pointer
          flex items-center justify-center overflow-hidden
          transition-all duration-500 ease-in-out
          ${isDark 
            ? "bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900" 
            : "bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200"
          }
          shadow-2xl
          border-2 ${isDark ? "border-purple-500/30" : "border-yellow-400/50"}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {/* Background glow */}
        <motion.div
          className={`absolute inset-0 rounded-full blur-md -z-10 ${isDark ? "bg-purple-500/30" : "bg-yellow-400/40"}`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Stars (dark mode) */}
        <AnimatePresence>
          {isDark && [...Array(5)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: `${15 + (i * 17) % 70}%`, left: `${10 + (i * 23) % 80}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </AnimatePresence>

        {/* Sun/Moon Icon */}
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden shadow-inner">
                <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900" />
                <div className="absolute w-1.5 h-1.5 bg-gray-300/60 rounded-full top-2 left-1" />
                <div className="absolute w-1 h-1 bg-gray-300/50 rounded-full bottom-2 left-3" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              className="relative"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-lg"
                animate={{ boxShadow: ["0 0 10px #fbbf24", "0 0 20px #fbbf24", "0 0 10px #fbbf24"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`ray-${i}`}
                  className="absolute w-0.5 h-2 bg-gradient-to-t from-yellow-400 to-orange-300 rounded-full origin-bottom"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 45}deg) translateX(-1px) translateY(-16px)`,
                  }}
                  animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export default FloatingThemeToggle;
