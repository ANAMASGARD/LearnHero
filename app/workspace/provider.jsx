import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/AppSidebar"

function WorkspaceProvider({children }) {
  return (
    <SidebarProvider>
        <AppSidebar />
         
        <div className="flex flex-col w-full h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 sm:p-6 md:p-10 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {children }
                </div>
                </div>
    </SidebarProvider>
    
  )
}

export default WorkspaceProvider