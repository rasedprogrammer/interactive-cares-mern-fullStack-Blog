"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd, House, Settings, UserRound, LayoutDashboard, UserStar } from "lucide-react";
import Link from "next/link";
import { FooterContent } from "./user-sidebar-footer";

export function UserSidebar({ email, firstName, lastName, role }) {
  return (
    <Sidebar collapsible="icon" className="h-screen">
      <div className="flex justify-between items-center">
        <SidebarHeader className="p-1">
          <Link
            href="/dashboard"
            className="hover:bg-sidebar-accent rounded-md p-1"
          >
            <div className="flex items-center">
              <div className="flex aspect-square size-[31px] items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm">
                <div className="font-semibold">Blog</div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarTrigger />
      </div>

      <SidebarContent className="mt-5 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <House />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Dashboard Blog */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/blog">
                <UserRound />
                <span>Blog</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/review">
                <UserStar />
                <span>Review</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <FooterContent firstName={firstName} lastName={lastName} email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
