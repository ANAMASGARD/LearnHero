import { UserButton } from '@clerk/nextjs'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const AppHeader = ({hideSidebar=false}) => {
  return (
    <div className='p-4 flex justify-between items-center shadow-md dark:bg-gray-900 dark:border-b dark:border-gray-800'>
         {!hideSidebar && <SidebarTrigger /> }
         <div className='flex items-center gap-4'>
           <UserButton /> 
         </div>
    </div>
  )
}

export default AppHeader