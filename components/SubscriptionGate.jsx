"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Crown, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export function SubscriptionGate({ children, type = 'course', showUpgrade = true }) {
  const { user } = useUser()
  const [allowed, setAllowed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(null)

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      checkLimit()
    }
  }, [user, type])

  const checkLimit = async () => {
    try {
      const response = await axios.get('/api/subscription/check')
      const limits = response.data.limits
      
      if (type === 'course') {
        const remaining = limits.courses.remaining
        setAllowed(remaining > 0 || limits.courses.limit === -1)
        setLimit(limits.courses)
      } else if (type === 'interview') {
        const remaining = limits.interviews.remaining
        setAllowed(remaining > 0 || limits.interviews.limit === -1)
        setLimit(limits.interviews)
      }
    } catch (error) {
      console.error('Error checking limit:', error)
      setAllowed(true) // Allow by default on error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="opacity-50">{children}</div>
  }

  if (allowed) {
    return <>{children}</>
  }

  if (!showUpgrade) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Limit Reached
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {type === 'course' 
              ? `You've reached your course limit (${limit?.limit || 10}). Upgrade to Pro for unlimited courses.`
              : `You've reached your interview limit (${limit?.limit || 10}). Upgrade to Pro for unlimited interviews.`
            }
          </p>
          <Link href="/workspace/billing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </motion.div>
  )
}

