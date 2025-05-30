
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Users, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/clients/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import { clientsAPI } from "@/integrations/api/client";

const Clients = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  // Check if the user is on a free plan (for core users)
  const isFreePlan = authState.user?.role === "core_user" &&
    (!authState.user.subscription || authState.user.subscription === "free");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientsAPI.getClients();
        setClients(response.data);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch clients.",
          variant: "destructive",
        });
      }
    };

    fetchClients();
  }, [authState.isAuthenticated]);

    // Get client limit based on plan (from backend)
    const getClientLimit = () => {
      let clientLimit = 3;
      if (authState.user?.role === "admin") return Infinity;
      if (authState.user?.subscription === "professional") clientLimit = 10;
      if (authState.user.subscription === "enterprise") clientLimit = 30;
      
      return clientLimit;
    };

  // Filter only clients created by the current core user (for core user role)
  const userSpecificClients = authState.user?.role === "core_user"
    ? clients.filter((client: any) => client.created_by === authState.user?.id)
    : clients;

  const filteredClients = clients.filter((client: any) => {
    return (
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteClient = (clientId: string) => {
    // This would connect to backend API in a real app
    // In a real app, you would call an API to delete the client
    toast({
      title: "Client Deleted",
      description: `Client has been successfully deleted.`,
    });
  };

  const handleManageReports = (clientId: string) => {
    // Navigate to reports management for this client
    navigate(`/reports?clientId=${clientId}`);
  };

  const handleClientFormSubmit = (success: boolean) => {
    if (success) {
      setIsDialogOpen(false);
    }
  };

  if (authState.user?.role === "client") {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  const canAddMoreClients = filteredClients.length < getClientLimit();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Clients Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-1"
              disabled={!canAddMoreClients}
              title={!canAddMoreClients ? "Client limit reached for your plan" : ""}
            >
              <Plus size={16} />
              <span>Add New Client</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client account for access to Power BI dashboards
              </DialogDescription>
            </DialogHeader>
            <ClientForm 
              onSubmit={handleClientFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Subscription Warning for core users */}
      {authState.user?.role === "core_user" && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isFreePlan ? "You are on the Free Plan" : "Professional Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {filteredClients.length} of {getClientLimit()} clients used
                </p>
              </div>
              {isFreePlan && (
                <Button size="sm" className="ml-auto">Upgrade Plan</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            Manage your Power BI dashboard clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created By</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date Added</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reports</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Login</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                          <Users size={16} />
                        </div>
                        <span className="font-medium">{client.companyName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{client.username}</td>
                    <td className="py-3 px-4">{client.createdBy}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{client.createdAt}</span>
                    </td>
                    <td className="py-3 px-4">{client.reportCount}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{client.lastLogin}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleManageReports(client.id)}>
                          Manage Reports
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No clients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
