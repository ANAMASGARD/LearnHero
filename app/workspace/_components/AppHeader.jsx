"use client"
import { UserButton } from '@clerk/nextjs'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { motion } from 'framer-motion'

const AppHeader = ({hideSidebar=false}) => {
  return (
    <motion.header 
      className='relative p-4 flex justify-between items-center shadow-lg dark:bg-gray-900 dark:border-b dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md overflow-hidden'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className='relative z-10 flex justify-between items-center w-full'>
        {!hideSidebar && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <SidebarTrigger />
          </motion.div>
        )}
        <motion.div 
          className='flex items-center gap-4 ml-auto'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserButton /> 
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default AppHeader