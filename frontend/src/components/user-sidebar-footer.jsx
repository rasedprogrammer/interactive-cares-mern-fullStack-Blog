"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyRound, LogOut, RotateCw, UserPen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FooterContent({ email, firstName, lastName }) {
  const [pending, setPending] = useState(false);

  async function logoutHandler() {
    setPending(true);
    // await logout(); // connect your backend logout later
    setPending(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage alt={firstName} />
            <AvatarFallback>{firstName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left text-sm">
            <div className="font-semibold">{firstName + " " + lastName}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/edit-profile">
              <UserPen /> Edit Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/change-password">
              <KeyRound /> Change Password
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pending} onClick={logoutHandler}>
          {pending ? <RotateCw className="animate-spin" /> : <LogOut />} Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
