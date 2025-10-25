"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  House,
  KeyRound,
  LogOut,
  RotateCw,
  Settings,
  UserPen,
  UserRound,
} from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { logout } from "@/actions/maintainer-actions";

export function UserSidebar({ email, firstName, lastName, role }) {
  console.log(role);

  return (
    <Sidebar collapsible="icon" className={"h-screen "}>
      {/* pt-[70px] */}
      <div className="flex justify-between items-center ">
        <SidebarHeader className="p-1">
          <Link
            href={"/dashboard"}
            className="hover:bg-sidebar-accent rounded-md p-1"
          >
            <div className="flex items-center">
              <div className="flex aspect-square size-[31px] items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm ">
                <div className="truncate font-semibold flex">
                  <div className="w-3 flex"></div> Blog site
                </div>
                <div className="truncate text-xs flex">
                  <div className="w-3 flex"></div> {role}
                </div>
              </div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarTrigger className="" />
      </div>
      <SidebarContent className="mt-5 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Home"} asChild>
              <Link href={"/"}>
                <House />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Blog"} asChild>
              <Link href={"/dashboard/blog"}>
                <UserRound />
                <span>Blog</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Review"} asChild>
              <Link href={"/dashboard/review"}>
                <UserRound />
                <span>Review</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Settings"} asChild>
              <Link href={"/dashboard/settings"}>
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <FooterContent
          firstName={firstName}
          lastName={lastName}
          email={email}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function FooterContent({ email, firstName, lastName }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage alt={firstName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {firstName + " " + lastName}
                </span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage alt={firstName} />
                  <AvatarFallback className="rounded-lg">{"CN"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{firstName}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/maintainer/settings/edit-profile"}>
                  <UserPen />
                  Edit Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/maintainer/settings/change-password"}>
                  <KeyRound />
                  Change Password
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function LogoutButton() {
  const [pending, setPending] = useState(false);
  async function onLogoutClick() {
    setPending(true);
    await logout();
    setPending(false);
  }
  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onLogoutClick();
      }}
    >
      {pending ? <RotateCw className="animate-spin" /> : <LogOut />}
      Log out
    </DropdownMenuItem>
  );
}
