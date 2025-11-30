import React from 'react'
import DashboardProvider from './provider'

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