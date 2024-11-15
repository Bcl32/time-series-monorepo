import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Rss,
  Brain,
  ShieldAlert,
  FileText,
  ChartNoAxesCombined,
  HeartPulse,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/utils/Sidebar";
import { Link } from "react-router-dom";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Collections",
    url: "/AllCollections",
    icon: Inbox,
  },
  {
    title: "Datafeeds",
    url: "/AllDatafeeds",
    icon: Rss,
  },
  {
    title: "Datasets",
    url: "/AllDatasets",
    icon: FileText,
  },
  {
    title: "Anomalies",
    url: "/AllAnomalies",
    icon: ShieldAlert,
  },
  {
    title: "Predictions",
    url: "/AllPredictions",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Detectors",
    url: "/AllDetectors",
    icon: Brain,
  },
  {
    title: "Health",
    url: "/AllHealth",
    icon: HeartPulse,
  },
];

export function MainSidebar() {
  return (
    <Sidebar className="bg-card" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
