"use client"
import React, { use } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import AddNewCourseDialog from './AddNewCourseDialog'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import CourseCard from './CourseCard'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'

function CourseList() {

    const [courses, setCourseList] = useState([]);
    const { user } = useUser();
    useEffect(() => {
      user && GetCourseList();
    }, [user]);

    const GetCourseList = async () => {
        const result = await axios.get('/api/courses');
        console.log(result.data);
        setCourseList(result.data);
        
    }
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
            className='mt-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                className='font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Sparkles className="w-5 h-5 text-primary" />
                CourseList
            </motion.h2>

            {courses?.length == 0 ? (
                <motion.div 
                    className='flex p-7 items-center justify-center flex-col border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-10 bg-white dark:bg-gray-800/50 relative overflow-hidden'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                >
                    {/* Animated background gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5"
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative z-10"
                    >
                        <Image src={'/rocket.gif'} alt="Go to moon" width={100} height={100}  />
                    </motion.div>
                    <motion.h2 
                        className='my-2 text-large font-bold text-gray-900 dark:text-gray-100 relative z-10'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Looks Like you haven't made any courses yet
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative z-10"
                    >
                        <AddNewCourseDialog>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Create your first course
                                </Button>
                            </motion.div>
                        </AddNewCourseDialog>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-rows-3 gap-5'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                     {courses?.map((course,index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                        >
                            <CourseCard course={course} refreshData={GetCourseList} />
                        </motion.div>
                    ))}
                </motion.div>
            )}  
        </motion.div>
    )
}

export default CourseList