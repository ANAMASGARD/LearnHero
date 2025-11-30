"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, X, CreditCard, Sparkles, Crown, Zap, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import Link from 'next/link'

// Force dynamic rendering to avoid Clerk build-time errors
export const dynamic = 'force-dynamic'

export default function BillingPage() {
  const { user } = useUser()
  const [subscription, setSubscription] = useState(null)
  const [limits, setLimits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadSubscriptionStatus()
    }
  }, [user])

  const loadSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/subscription/check')
      setSubscription(response.data.subscription)
      setLimits(response.data.limits)
    } catch (error) {
      console.error('Error loading subscription:', error)
      toast.error('Failed to load subscription status')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      setProcessing(true)
      
      // Price ID will be handled by the backend using environment variable
      const response = await axios.post('/api/subscription/create', {})

      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Error upgrading:', error)
      toast.error(error.response?.data?.error || 'Failed to start upgrade process')
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    try {
      setProcessing(true)
      const response = await axios.post('/api/subscription/cancel')
      toast.success(response.data.message || 'Subscription will be canceled at the end of billing period')
      loadSubscriptionStatus()
    } catch (error) {
      console.error('Error canceling:', error)
      toast.error(error.response?.data?.error || 'Failed to cancel subscription')
    } finally {
      setProcessing(false)
    }
  }

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    const diff = end - now
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isPro = subscription?.plan === 'pro' && subscription?.isActive
  const isTrial = subscription?.isTrial
  const daysRemaining = isTrial ? getDaysRemaining(subscription?.trialEndDate) : 0

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-primary" />
          Billing & Subscription
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your subscription and billing information
        </p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {isPro ? (
                <>
                  <Crown className="w-6 h-6 text-yellow-500" />
                  Pro Plan
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 text-primary" />
                  Basic Plan
                </>
              )}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isPro ? 'Unlimited access to all features' : 'Limited access with trial period'}
            </p>
          </div>
          {isPro && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={processing}
                className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Subscription'}
              </Button>
            </motion.div>
          )}
        </div>

        {isTrial && daysRemaining > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>{daysRemaining} days</strong> remaining in your free trial
            </p>
          </div>
        )}

        {/* Usage Stats */}
        {limits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {limits.courses.limit === -1 ? (
                  <span className="text-primary">Unlimited</span>
                ) : (
                  <>
                    {limits.courses.used} / {limits.courses.limit}
                  </>
                )}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {limits.interviews.limit === -1 ? (
                  <span className="text-primary">Unlimited</span>
                ) : (
                  <>
                    {limits.interviews.used} / {limits.interviews.limit}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Plan Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <motion.div
            className={`relative border-2 rounded-xl p-6 ${
              !isPro
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {!isPro && (
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                Current
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Basic</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              $0<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>10 Courses</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>10 AI Interviews</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>30-Day Free Trial</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>Progress Tracking</span>
              </li>
            </ul>
            {!isPro && (
              <Button disabled className="w-full" variant="outline">
                Current Plan
              </Button>
            )}
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className={`relative border-2 rounded-xl p-6 ${
              isPro
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-primary bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {isPro && (
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                Current
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              $9.99<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>Unlimited Courses</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>Unlimited AI Interviews</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" />
                <span>Priority Support</span>
              </li>
            </ul>
            {!isPro ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleUpgrade}
                  disabled={processing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upgrade to Pro'
                  )}
                </Button>
              </motion.div>
            ) : (
              <Button disabled className="w-full" variant="outline">
                Current Plan
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-xl p-6 border border-primary/20 dark:border-primary/30"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Need Help?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          If you have any questions about billing or subscriptions, please contact our support team.
        </p>
        <Link href="/workspace">
          <Button variant="outline" size="sm">
            Back to Workspace
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

