"use client";
import { useEffect } from 'react';
import axios from 'axios'
import React from 'react'
import { useState } from 'react';
import EnrollCourseCard from './EnrollCourseCard';
import { motion } from 'framer-motion';

function EnrollCourseList() {

    const [enrolledCourseList, setEnrolledCourseList] = useState([]);
       useEffect(() => {
        GetEnrolledCourse();
    }, []);


    const GetEnrolledCourse = async () => {
        const result = await axios.get('/api/enroll-course');
        console.log(result.data);
        
            setEnrolledCourseList(result.data);
        
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

  return enrolledCourseList?.length > 0 && (
    <motion.div 
        className='mt-3'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <motion.h2 
            className='font-bold text-xl text-gray-900 dark:text-gray-100 mb-5'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            Continue Learning your Courses
        </motion.h2>
        <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
        {enrolledCourseList?.map((course, index) => (
            <motion.div
                key={index}
                variants={{
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
                }}
            >
                <EnrollCourseCard 
                  course={course?.courses}  // Note: "courses" not "course"
                  enrollCourse={course?.enrollCourses}  // Note: "enrollCourses" not "enrollCourse"
                />
            </motion.div>
        ))}
        </motion.div>
    </motion.div>
  )
}

export default EnrollCourseList