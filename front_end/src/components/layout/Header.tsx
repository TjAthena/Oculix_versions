
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-powerbi-blue hidden md:block">Power BI Nexus Hub</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-right mr-2">
          <p className="font-medium">{authState.user?.firstName} {authState.user?.lastName}</p>
          <p className="text-xs text-gray-500 capitalize">{authState.user?.role.replace('_', ' ')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-powerbi-gray">
            <User size={18} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
