
import { 
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, User, FileText } from "lucide-react";

export default function Sidebar() {
  const { authState } = useAuth();
  const userRole = authState.user?.role;
  
  return (
    <SidebarContainer>
      <SidebarHeader className="flex justify-center items-center h-16 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-powerbi-blue rounded-md p-1">
            <span className="text-white font-bold text-lg">PBI</span>
          </div>
          <span className="font-bold text-lg text-powerbi-blue">Nexus Hub</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {(userRole === "admin" || userRole === "core_user") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/clients" className="flex items-center gap-3">
                      <Users size={18} />
                      <span>Clients</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {userRole === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/users" className="flex items-center gap-3">
                      <User size={18} />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {userRole === "client" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/reports" className="flex items-center gap-3">
                      <FileText size={18} />
                      <span>My Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
}
