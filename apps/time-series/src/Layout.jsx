import { SidebarProvider, SidebarTrigger } from "@repo/utils/Sidebar";
import { Separator } from "@repo/utils/Separator";
import { MainSidebar } from "./MainSidebar";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@repo/utils/ThemeProvider";
import { ModeToggle } from "@repo/utils/ModeToggle";

export default function Layout({ children }) {
  return (
    <div className="bg-background text-foreground">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarProvider>
          <MainSidebar />
          <main>
            <header className="flex h-10 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ModeToggle></ModeToggle>
            </header>

            {children}
            <Outlet />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
