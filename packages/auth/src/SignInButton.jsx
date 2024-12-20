import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./AuthConfig";
import { Button } from "@repo/utils/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/utils/Dropdown";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e);
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <span>Sign In</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          key="sign_in_popup"
          onClick={() => handleLogin("popup")}
        >
          Sign in using Popup
        </DropdownMenuItem>
        <DropdownMenuItem
          key="sign_in_redirect"
          onClick={() => handleLogin("redirect")}
        >
          Sign in using Redirect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
