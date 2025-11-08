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
    path:'/workspace/my-learning',
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
        <Image
          src={'/logo.svg'}
          alt="Logo"
          width={50}
          height={30}
          
        />
      
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
            {/* <AddNewCourseDialog> */}
         <Button>
            Create Mock Test 
         </Button>
         {/* </AddNewCourseDialog> */}

            </SidebarGroup>
        <SidebarGroup >
            <SidebarGroupContent>
                <SidebarMenu>
                    {SidebarOptions.map((item,index ) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild className={'p-5'}>
                                <Link href ={item.path} className={`text-[17px]
                                ${path.includes(item.path) && 'text-primary bg-purple-50'}`
                                    
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