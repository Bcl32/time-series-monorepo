import {
  AuthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { SignInButton } from "@repo/auth/SignInButton";
import { SignOutButton } from "@repo/auth/SignOutButton";
import { AuthStatusPanel } from "@repo/auth/AuthStatusPanel";

import { SidebarProvider, SidebarTrigger } from "@repo/utils/Sidebar";
import { Separator } from "@repo/utils/Separator";
import { MainSidebar } from "./MainSidebar";
import { Outlet } from "react-router-dom";
import { DialogButton } from "@repo/utils/DialogButton";
import { Button } from "@repo/utils/Button";

import { Theming } from "@repo/themes/Theming";
import { ThemeProvider } from "@repo/themes/ThemeProvider";

import { NavigationProvider } from "./NavigationProvider";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

export default function Layout({ children }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const isAuthenticated = useIsAuthenticated();

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <NavigationProvider>
        <SidebarProvider>
          <MainSidebar />
          <main>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />

              <DialogButton
                button={<Button variant="default">Themes</Button>}
                size="big"
                title="Theme Editor"
              >
                <Theming />
              </DialogButton>
              <NavigationBreadcrumb />
            </header>

            {/* {isAuthenticated ? <SignOutButton /> : <SignInButton />}
            <AuthenticatedTemplate>
              {activeAccount ? <p>You are signed in</p> : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <p>Please sign in!</p>
            </UnauthenticatedTemplate> */}

            {children}
            <Outlet />
          </main>
        </SidebarProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}
