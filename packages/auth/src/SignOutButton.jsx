import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@repo/utils/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/utils/Dropdown";
/**
 * Renders a drop down button with child buttons for logging out with a popup or redirect
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } else if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <span>Sign Out</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          key="sign_out_popup"
          onClick={() => handleLogout("popup")}
        >
          Sign out using Popup
        </DropdownMenuItem>
        <DropdownMenuItem
          key="sign_out_redirect"
          onClick={() => handleLogout("redirect")}
        >
          Sign out using Redirect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
