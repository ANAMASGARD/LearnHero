"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Crown, Zap, Clock } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export function SubscriptionBadge({ className = "" }) {
  const { user } = useUser()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const response = await axios.get('/api/subscription/check')
      setSubscription(response.data.subscription)
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !subscription) {
    return null
  }

  const isPro = subscription.plan === 'pro' && subscription.isActive
  const isTrial = subscription.isTrial

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    const diff = end - now
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const daysRemaining = isTrial ? getDaysRemaining(subscription.trialEndDate) : 0

  return (
    <Link href="/workspace/billing">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${className}`}
      >
        {isPro ? (
          <>
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400">Pro</span>
          </>
        ) : isTrial && daysRemaining > 0 ? (
          <>
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400">
              Trial: {daysRemaining}d left
            </span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary">Basic</span>
          </>
        )}
      </motion.div>
    </Link>
  )
}

