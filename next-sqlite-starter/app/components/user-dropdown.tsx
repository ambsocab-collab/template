"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

export function UserDropdown() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center focus:outline-none">
        <Image
          src={user.imageUrl}
          alt={user.fullName || "User avatar"}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="flex w-full items-center cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
