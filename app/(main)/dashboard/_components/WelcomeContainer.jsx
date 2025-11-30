"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'

function WelcomeContainer() {
    const { user } = useUser();

    return (
        <motion.header 
            className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-800/90 backdrop-blur-md border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-gray-900/50 sticky top-4 z-50 mx-4 mb-4 overflow-hidden"
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
            
            {/* Left side - Welcome text */}
            <div className="flex-1 min-w-0 relative z-10">
                <motion.h1 
                    className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Welcome back, {user?.firstName || 'User'} 👋
                </motion.h1>
                <motion.p 
                    className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    Ready to create amazing interviews?
                </motion.p>
            </div>

            {/* Right side - User button */}
            <motion.div 
                className="flex-shrink-0 ml-4 relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
            >
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-6 md:w-10 md:h-10"
                        }
                    }}
                />
            </motion.div>
        </motion.header>
    )
}

export default WelcomeContainer