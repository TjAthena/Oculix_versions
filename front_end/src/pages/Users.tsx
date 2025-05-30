import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { authAPI } from "@/integrations/api/client";

const Users = () => {
  const { authState } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // state for real user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authAPI.getUsers();
        setUsers(response.data); // Assuming API returns an array of user objects
        console.log(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    

    if (authState.user?.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [authState.user?.role]);

  // Filter users based on search
  const filteredUsers = users.filter((user: any) =>
    [user.name, user.email, user.company, user.role]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (authState.user?.role !== "admin") {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage the users in your Power BI Nexus Hub system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          user.role === "admin"
                            ? "bg-powerbi-blue/10 text-powerbi-blue"
                            : "bg-powerbi-lightblue/10 text-powerbi-lightblue"
                        }`}>
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.company_name || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{user.created_at}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          user.status === "active" ? "bg-green-500" : "bg-gray-300"
                        }`}></span>
                        <span className="text-sm capitalize">{user.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
