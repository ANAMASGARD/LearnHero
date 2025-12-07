import React from 'react'
import DashboardProvider from './provider'

// Force dynamic rendering for all pages in this layout (uses Clerk)
export const dynamic = 'force-dynamic'

function DashboardLayout({ children }) {
  return (
    <div className='bg-secondary dark:bg-gray-900'>
        <DashboardProvider>
            <div className='p-10 bg-secondary dark:bg-gray-900'>
               { children }
            </div>
           
        </DashboardProvider>
        </div>
  )
}

export default DashboardLayout