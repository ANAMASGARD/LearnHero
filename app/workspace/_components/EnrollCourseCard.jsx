"use client"
import React from 'react'
import Image from 'next/image'
import { BookAIcon, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

function EnrollCourseCard({course, enrollCourse}) {
    // Get course data safely with multiple fallback paths
    const courseName = course?.courseJson?.course?.name || "Untitled Course";
    const courseDescription = course?.courseJson?.course?.description || course?.description || "No description available";
    
    // Log data to help debug
    console.log("Course in card:", course);
    console.log("Course name:", courseName);
    console.log("Course description:", courseDescription);

    const calculateProgress = () => {
        // Get number of completed chapters (defaulting to 0 if null/undefined)
        const completed = enrollCourse?.completedChapters?.length || 0;
        
        // Get total number of chapters from courseContent (defaulting to 1 to avoid division by zero)
        const total = course?.courseContent?.length || 1;
        
        // Calculate percentage with fallback to 0 for NaN
        const progress = (completed / total) * 100;
        return isNaN(progress) ? 0 : progress;
    }

    const progress = calculateProgress();

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
            
            <motion.div
                className="relative overflow-hidden rounded-t-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <Image 
                    src={course?.courseImage || '/rocket.gif'} 
                    alt={courseName || "Course banner"} 
                    width={400} 
                    height={300}  
                    className='w-full aspect-video rounded-t-xl object-cover'
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
                    {courseName}
                </motion.h2>
                <motion.p 
                    className='line-clamp-2 text-gray-500 dark:text-gray-400 text-sm flex-grow'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {courseDescription}
                </motion.p>
                
                <div className='mt-auto pt-2'>
                    <motion.div 
                        className='flex justify-between text-sm text-primary dark:text-blue-400 mb-2'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="font-medium">Progress</span>
                        <motion.span
                            key={progress}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            {progress.toFixed(0)}%
                        </motion.span>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Progress value={progress} className="h-2 my-2" />
                    </motion.div>

                    <Link href={'/workspace/view-course/'+course?.cid} className='block w-full mt-3'>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button className='w-full gap-1 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all'>
                                <motion.div
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <PlayCircle className="h-4 w-4" />
                                </motion.div>
                                Continue Learning
                            </Button>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default EnrollCourseCard