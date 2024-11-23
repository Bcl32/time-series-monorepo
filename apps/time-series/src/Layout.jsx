import { SidebarProvider, SidebarTrigger } from "@repo/utils/Sidebar";
import { Separator } from "@repo/utils/Separator";
import { MainSidebar } from "./MainSidebar";
import { Outlet } from "react-router-dom";
import { DialogButton } from "@repo/utils/DialogButton";
import { Button } from "@repo/utils/Button";

import { ThemeGenerator } from "@repo/themes/ThemeGenerator";
import { ThemeProvider } from "@repo/themes/ThemeProvider";
import { ThemeSelector } from "@repo/themes/ThemeSelector";

export default function Layout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <MainSidebar />
        <main>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ThemeSelector></ThemeSelector>

            <DialogButton
              button={<Button variant="default">Themes</Button>}
              size="big"
              title="Theme Editor"
            >
              <ThemeGenerator />
            </DialogButton>
          </header>

          {children}
          <Outlet />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
