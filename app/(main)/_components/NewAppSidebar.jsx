"use client"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem

} from "@/components/ui/sidebar"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { BookA, Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon,User2Icon , WalletCards ,Video , List } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

// import AddNewCourseDialog from "./AddNewCourseDialog"

const SidebarOptions = [ {
    title: "Dashboard",
    icon:LayoutDashboard,
    path:'/dashboard/#',
},
{
    title: "Interviews",
    icon: Video,
    path:'/dashboard/create-interview',
},
 {
    title:'All Interview',
    icon:List,
    path:'/recruiter/all-interview',
},
{
    title: "Billing",
    icon:WalletCards,
    path:'/workspace/billing',
},{
    title: "Profile",
    icon:UserCircle2Icon,
    path:'/workspace/profile',
},
]

export function NewAppSidebar() {
   const path=usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={'p-4'} > 
        <Link href="/workspace" className="cursor-pointer">
          <Image
            src={'/logo.svg'}
            alt="Logo"
            width={50}
            height={30}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
            <Link href="/dashboard/create-interview" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Create New Interview
              </Button>
            </Link>
            </SidebarGroup>
        <SidebarGroup >
            <SidebarGroupContent>
                <SidebarMenu>
                    {SidebarOptions.map((item,index ) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild className={'p-5'}>
                                <Link href={item.path} className={`text-[17px] text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary
                                ${path === item.path || (item.path !== '/dashboard/#' && path.startsWith(item.path)) ? 'text-primary bg-primary/10 dark:bg-primary/20' : ''}`
                                    
                                }>
                                <item.icon className="h-7 w-7" />
                                    <span >
                                        {item.title}
                                    </span>
                                </Link>
                                </SidebarMenuButton>

                            
                           
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </ SidebarGroup >
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default NewAppSidebar