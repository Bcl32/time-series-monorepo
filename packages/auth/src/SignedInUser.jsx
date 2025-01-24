import React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/utils/Sidebar";
import { SignOutButton } from "./SignOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/utils/Dropdown";

import { UserIcon } from "./UserIcon";

import { ChevronsUpDown } from "lucide-react";

export function SignedInUser({ userInfo }) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex">
              <div>
                <UserIcon name={userInfo.name}></UserIcon>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userInfo.name}</span>
                <span className="truncate text-xs">
                  {userInfo.preferred_username}
                </span>
              </div>
            </div>

            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={"right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold"> {userInfo.name}</span>
                <span className="truncate text-xs">
                  {" "}
                  {userInfo.preferred_username}
                </span>
              </div>
              <SignOutButton></SignOutButton>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuGroup></DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
