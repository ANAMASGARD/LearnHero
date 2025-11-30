"use client"
import React from 'react'
import { Camera, Video } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  return (
    <div className='my-5'>
        <h2 className='font-bold text-2xl text-gray-900 dark:text-gray-100'>
            Previously Created Interviews  
        </h2>

        {interviewList?.length==0&&
        <div className='p-5 flex flex-col gap-3 items-center mt-3'>
            <Video className='h-10 w-10 text-primary' />
            <h2 className='text-gray-900 dark:text-gray-100'> You don't have any interview created!</h2>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'> +  Create New Interview </Button>
        </div>}
    </div>
  )
}

export default LatestInterviewsList