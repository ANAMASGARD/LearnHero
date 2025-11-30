"use client"
import { Phone, Sparkles } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function CreateOptions() {
  return (
    <motion.div 
      className='grid grid-cols-1 gap-5'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Interview Code Card */}
      <Link href={'/dashboard/create-interview'}>
        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg dark:shadow-gray-900/50 cursor-pointer flex flex-col h-full overflow-hidden group"
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>

          <div className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Phone className="p-3 text-primary bg-primary/10 dark:bg-primary/20 rounded-xl h-14 w-14" />
            </motion.div>
            <h2 className="mt-4 mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              Create New Interview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Start creating AI-powered interviews to assess candidates with intelligent question generation and automated feedback.
            </p>
            <motion.div 
              className="mt-6 flex items-center text-primary font-medium text-sm"
              whileHover={{ x: 5 }}
            >
              Get Started <span className="ml-2">→</span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default CreateOptions