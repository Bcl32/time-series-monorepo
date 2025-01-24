import React from "react";
import {
  AuthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { SignedInUser } from "./SignedInUser";

import {
  BadgeCheck,
  User,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/utils/Sidebar";

import { useIsMobile } from "@repo/utils/UseIsMobile";
import { UserIcon } from "./UserIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/utils/Dropdown";
import { NotSignedIn } from "./NotSignedIn";

export function AuthCurrentUser({ user }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const isAuthenticated = useIsAuthenticated();

  return (
    <SidebarMenu>
      <div>
        {isAuthenticated ? (
          <SignedInUser userInfo={activeAccount.idTokenClaims}></SignedInUser>
        ) : (
          <NotSignedIn></NotSignedIn>
        )}
      </div>
    </SidebarMenu>
  );
}
