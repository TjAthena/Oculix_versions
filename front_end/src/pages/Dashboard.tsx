
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authAPI } from "@/integrations/api/client";
import { formatDistanceToNow } from 'date-fns';

const DashboardCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [userCounts, setUserCounts] = useState<{ total_users: number; core_users: number; client_users: number; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await authAPI.getUsers();
        setUsers(usersResponse.data);

        const userCountsResponse = await authAPI.getUserCounts();
        setUserCounts(userCountsResponse.data);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Users" value={userCounts?.total_users?.toString() || "Loading..."} icon={<Users className="h-5 w-5" />} />
        <DashboardCard title="Core Users" value={userCounts?.core_users?.toString() || "Loading..."} icon={<User className="h-5 w-5" />} />
        <DashboardCard title="Client Users" value={userCounts?.client_users?.toString() || "Loading..."} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Recent Core Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className="space-y-2">
                {users.map((user, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Recent Client Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Acme Corporation", added: "1 day ago", by: "Alex Johnson" },
                { name: "Global Industries", added: "3 days ago", by: "Sarah Miller" },
                { name: "Tech Innovators", added: "5 days ago", by: "Alex Johnson" },
                { name: "Data Analytics Ltd", added: "1 week ago", by: "James Wilson" }
              ].map((client, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">Added by: {client.by}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{client.added}</span>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/clients')}
              >
                View All Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CoreUserDashboard = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  // Mock subscription plans
  const subscriptionPlan = {
    name: "Professional",
    clientLimit: 5,
    reportLimit: 15,
    expiresAt: "2024-12-31"
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Core User Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="My Clients" value="5" icon={<Users className="h-5 w-5" />} />
        <DashboardCard title="Active Reports" value="12" icon={<FileText className="h-5 w-5" />} />
        <DashboardCard title="Plan" value={subscriptionPlan.name} icon={<User className="h-5 w-5" />} />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Client Limit:</span>
              <span>{5} / {subscriptionPlan.clientLimit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Report Limit:</span>
              <span>{12} / {subscriptionPlan.reportLimit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan Expires:</span>
              <span>{subscriptionPlan.expiresAt}</span>
            </div>
            <Button className="w-full mt-4">Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">My Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Client Company", added: "1 week ago", reports: 3 },
              { name: "Acme Corporation", added: "2 weeks ago", reports: 5 },
              { name: "Global Industries", added: "1 month ago", reports: 2 },
              { name: "Tech Solutions", added: "2 months ago", reports: 2 }
            ].map((client, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">Added: {client.added}</p>
                </div>
                <span className="text-sm bg-muted px-2 py-1 rounded">{client.reports} reports</span>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/clients')}
            >
              View All Clients
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Client Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Available Reports" value="3" icon={<FileText className="h-5 w-5" />} />
        <DashboardCard title="Last Login" value="Today" icon={<User className="h-5 w-5" />} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Power BI Reports</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Sales Analysis", type: "Dashboard", updated: "1 day ago" },
            { name: "Customer Insights", type: "Report", updated: "3 days ago" },
            { name: "Financial Overview", type: "Dashboard", updated: "1 week ago" }
          ].map((report, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="bg-powerbi-blue h-1"></div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Updated: {report.updated}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/reports')}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { authState } = useAuth();
  const userRole = authState.user?.role;
  
  return (
    <>
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "core_user" && <CoreUserDashboard />}
      {userRole === "client" && <ClientDashboard />}
    </>
  );
};

export default Dashboard;
