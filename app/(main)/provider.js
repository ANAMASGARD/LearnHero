import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import NewAppSidebar from './_components/NewAppSidebar'

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
        <NewAppSidebar />
    <div className='w-full p-10'>
        <SidebarTrigger />
        { children }
        </div>
         </SidebarProvider>
  )
}

export default DashboardProvider