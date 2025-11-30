"use client"
import { Phone, File as FileIcon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function CreateOptions() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      {/* Interview Code Card */}
      <Link href={'/dashboard/create-interview'}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm dark:shadow-gray-900/50 cursor-pointer flex flex-col h-full hover:shadow-md transition-shadow duration-200">
          <Phone className="p-2 text-primary bg-primary/10 dark:bg-primary/20 rounded-lg h-12 w-12" />
          <h2 className="mt-3 mb-2 font-semibold text-gray-900 dark:text-gray-100">Interview Code</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Get your code or link from your recruiter.
          </p>
          <div className="mt-auto">
            <div className="w-full h-[7px]"></div> {/* Spacer to match button height */}
          </div>
        </div>
      </Link>

      {/* Upload CV Card */}
      <Link href={'/candidate/upload-cv'}>
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm dark:shadow-gray-900/50 cursor-pointer flex flex-col h-full hover:shadow-md transition-shadow duration-200'>
          <FileIcon className='p-2 text-primary bg-primary/10 dark:bg-primary/20 rounded-lg h-12 w-12' />
          <h2 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">Upload your CV</h2>
          <p className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
            Create AI interviews and schedule them with candidates
          </p>
          <div className="mt-auto">
            <div className="w-full h-[7px]"></div> {/* Spacer to match button height */}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CreateOptions