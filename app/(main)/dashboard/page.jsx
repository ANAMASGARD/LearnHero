"use client"
import React, { useState, useEffect } from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

// Force dynamic rendering to avoid Clerk build-time errors
export const dynamic = 'force-dynamic'
import { Users, Award, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageRating: 0,
    recommended: 0,
    totalCandidates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await axios.get(`/api/interview-results?email=${user.primaryEmailAddress.emailAddress}`);
      const results = response.data || [];
      
      const totalInterviews = results.length;
      const totalCandidates = new Set(results.map(r => r.fullname)).size;
      
      const averageRating = totalInterviews > 0
        ? results.reduce((sum, r) => {
            const ratings = r.feedback?.feedback?.rating || {};
            const avg = Object.keys(ratings).length > 0
              ? Object.values(ratings).reduce((s, v) => s + (v || 0), 0) / Object.keys(ratings).length
              : 0;
            return sum + avg;
          }, 0) / totalInterviews
        : 0;
      
      const recommended = results.filter(r => 
        r.feedback?.feedback?.Recommendation?.toLowerCase().includes('yes') || 
        r.feedback?.feedback?.Recommendation?.toLowerCase().includes('hire')
      ).length;

      setStats({
        totalInterviews,
        averageRating,
        recommended,
        totalCandidates
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <WelcomeContainer /> 
      
      {/* Quick Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        variants={containerVariants}
      >
        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/50 overflow-hidden group"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Interviews</p>
              <motion.p 
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {loading ? '...' : stats.totalInterviews}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/50 overflow-hidden group"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <motion.p 
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {loading ? '...' : stats.averageRating.toFixed(1)}/10
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Award className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/50 overflow-hidden group"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-colors"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Recommended</p>
              <motion.p 
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                {loading ? '...' : stats.recommended}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-gray-900/50 overflow-hidden group"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Candidates</p>
              <motion.p 
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                {loading ? '...' : stats.totalCandidates}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
        </motion.div>
        <CreateOptions />
      </motion.div>

      {/* Recent Interviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <LatestInterviewsList />
      </motion.div>

      {/* Helpful Links */}
      <motion.div 
        className="relative bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-primary/20 rounded-xl p-6 border border-primary/20 dark:border-primary/30 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Need Help Getting Started?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Create your first AI-powered interview to start assessing candidates efficiently.
          </p>
          <Link href="/dashboard/create-interview">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Your First Interview <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard