"use client"
import React from 'react'
import Image from 'next/image'
import { BookAIcon, LoaderPinwheel, PlayCircle, Settings, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import DeleteCourseButton from './DeleteCourseButton';
import { motion } from 'framer-motion';

function CourseCard({course, refreshData}) {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const onEnrollCourse = async () => {
    try {
    setLoading(true);
      const result = await axios.post('/api/enroll-course', {
        courseId: course?.cid
      });
      console.log(result.data);
      if (result.data.resp) {
        toast.warning('Already enrolled in this course');
        setLoading(false);
        return;

      }
      toast.success('Successfully enrolled in course');
      setLoading(false);
    } catch (error) {
      toast.error('Server Side error ! Failed to enroll in course');
      setLoading(false);
    }
  }
  
  return (
    <motion.div 
      className='relative shadow-md rounded-xl flex flex-col h-full overflow-hidden dark:shadow-gray-800/50 group'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Delete Button - Top Right Corner */}
      <div className="absolute top-2 right-2 z-20">
        <DeleteCourseButton 
          courseId={course?.cid} 
          courseName={courseJson?.name || 'this course'} 
          onDelete={refreshData}
        />
      </div>
      
      <motion.div
        className="relative overflow-hidden rounded-t-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image 
          src={course?.courseImage || '/rocket.gif'} 
          alt={courseJson?.name || "Course image"} 
          width={500} 
          height={300}  
          className='w-full aspect-video object-cover rounded-t-xl'
        />
        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />
      </motion.div>
      
      <div className='p-4 flex flex-col gap-3 bg-white dark:bg-gray-800 flex-grow rounded-b-xl relative'>
        <motion.h2 
          className='font-bold text-lg line-clamp-1 text-gray-900 dark:text-gray-100'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {courseJson?.name}
        </motion.h2>
        <motion.p 
          className='line-clamp-2 text-gray-500 dark:text-gray-400 text-sm flex-grow'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {courseJson?.description}
        </motion.p>
        
        <div className='flex flex-col gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700'>
          <motion.div 
            className='flex items-center text-sm text-gray-600 dark:text-gray-300'
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <BookAIcon className='text-primary dark:text-blue-400 h-4 w-4 mr-2' />
            </motion.div>
            {courseJson?.noOfChapters} Chapters
          </motion.div>
          
          {course?.courseContent?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="sm" 
                className="w-full mt-1 gap-2 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                onClick={onEnrollCourse}
                disabled={loading}
              >
                {loading ? (
                  <LoaderPinwheel className='animate-spin'/>
                ) : (
                  <>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </motion.div>
                    Enroll Course
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={'/workspace/edit-course/' + course?.cid} className="w-full">
                <Button
                  size="sm"
                  className="w-full mt-1 gap-2 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-primary/30 dark:border-primary/50 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-primary dark:hover:border-primary transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </motion.div>
                  Generate Course
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard