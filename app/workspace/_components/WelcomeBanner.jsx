"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SubscriptionBadge } from '@/components/SubscriptionBadge'

function WelcomeBanner ({hideSidebar=false}){
  return (
    <motion.div 
      className='relative p-4 sm:p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-600 rounded-xl shadow-lg overflow-hidden mb-4'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          backgroundSize: "200% 200%"
        }}
      />
      
      {/* Floating sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 30}%`,
            left: `${10 + i * 40}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </motion.div>
      ))}

      <div className='relative z-10 flex items-center justify-between'>
        <div className='flex items-center gap-4 flex-1'>
          {!hideSidebar && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <SidebarTrigger className="text-white" />
            </motion.div>
          )}
          <div>
            <motion.h2 
              className='font-bold text-lg sm:text-xl text-white mb-1'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to LearnHero
            </motion.h2>
            <motion.p 
              className='text-white/90 text-xs sm:text-sm'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Learn, Create and Explore Your educational courses.
            </motion.p>
          </div>
        </div>

        {/* Subscription Badge and User Button */}
        <div className="flex items-center gap-3">
          <SubscriptionBadge className="bg-white/20 dark:bg-gray-800/20 text-white border border-white/30" />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 md:w-10 md:h-10"
                }
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

export default WelcomeBanner