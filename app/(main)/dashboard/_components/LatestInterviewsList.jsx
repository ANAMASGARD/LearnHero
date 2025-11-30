"use client"
import React, { useState, useEffect } from 'react'
import { Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { motion } from 'framer-motion';

function LatestInterviewsList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      loadInterviews();
    }
  }, [user]);

  const loadInterviews = async () => {
    try {
      const response = await axios.get(`/api/interview-results?email=${user.primaryEmailAddress.emailAddress}`);
      setInterviewList(response.data || []);
    } catch (error) {
      console.error('Error loading interviews:', error);
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className='my-5'>
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100'>
            Recent Interview Results
          </h2>
          {interviewList.length > 0 && (
            <Link href="/dashboard/interviews">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="text-primary">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {loading ? (
          <motion.div 
            className='p-5 flex flex-col gap-3 items-center mt-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className='text-gray-600 dark:text-gray-400'>Loading interviews...</p>
          </motion.div>
        ) : interviewList?.length === 0 ? (
          <motion.div 
            className='p-8 sm:p-12 flex flex-col gap-4 items-center mt-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Video className='h-8 w-8 text-primary' />
            </motion.div>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 text-center'>
              No interviews created yet!
            </h2>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-md'>
              Start creating AI-powered interviews to assess candidates and track their performance.
            </p>
            <Link href="/dashboard/create-interview">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground mt-2'>
                  + Create New Interview
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {interviewList.slice(0, 3).map((interview, index) => {
              const ratings = interview.feedback?.feedback?.rating || {};
              const avgRating = Object.keys(ratings).length > 0
                ? Object.values(ratings).reduce((s, v) => s + (v || 0), 0) / Object.keys(ratings).length
                : 0;
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Link 
                    href="/dashboard/interviews"
                    className="block"
                  >
                    <motion.div 
                      className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer overflow-hidden relative group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {interview.interview?.jobPosition || 'Interview'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {interview.fullname} • {new Date(interview.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.div 
                          className="ml-4 text-right"
                          whileHover={{ scale: 1.1 }}
                        >
                          <p className="text-xl font-bold text-primary">{avgRating.toFixed(1)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
    </div>
  )
}

export default LatestInterviewsList