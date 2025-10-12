import {
  Calendar,
  Home,
  Inbox,
  Settings,
  User,
  Play,
  List,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar"; // Assuming sidebar context/hook
import { NavLink } from "react-router-dom";

// Menu items for routes.
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Players", url: "/players", icon: User },
  { title: "Games", url: "/games", icon: Play },
  { title: "Leaderboard", url: "/leaderboard", icon: List },
  { title: "Contact", url: "/contact", icon: Inbox },
  { title: "About", url: "/about", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar(); // Get collapsed state

  return (
    <Sidebar variant="floating" collapsible="offcanvas" defaultValue={false}>
      <SidebarHeader>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  onClick={() => {
                    // Close sidebar on item click
                    if (isMobile) {
                      setOpenMobile(false);
                    } else {
                      setOpen(false);
                    }
                  }}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "font-semibold text-blue-600" : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {open ? (
          <div className="p-4 text-sm flex flex-col gap-2">
            <div>© 2024 Your Company</div>
            <ThemeToggle />
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
