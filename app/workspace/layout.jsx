import React from 'react'
import WorkspaceProvider from './provider'

// Force dynamic rendering for all pages in this layout (uses Clerk)
export const dynamic = 'force-dynamic'

const WorkspaceLayout = ({children}) => {
  return (
   <WorkspaceProvider>
    {children}
   </WorkspaceProvider>
  )
}

export default WorkspaceLayout