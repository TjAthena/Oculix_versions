
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Report, ReportCreation } from "@/types";
import ReportsList from "@/components/reports/ReportsList";
import ReportViewer from "@/components/reports/ReportViewer";
import { useToast } from "@/components/ui/use-toast";
import { getReports, createReport, deleteReport } from "@/services/reportService";
import { getClients } from "@/services/clientService";

const Reports = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ReportCreation>({
    name: "",
    clientId: clientId || "",
    powerBIEmbedUrl: "",
    type: "Dashboard"
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<{id: string, companyName: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create a mapping of client IDs to names for easier access
  const clientNames = clients.reduce((map, client) => {
    map[client.id] = client.companyName;
    return map;
  }, {} as {[key: string]: string});
  
  // Fetch reports and clients data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports based on user role and clientId
        const reportsData = await getReports(clientId || undefined);
        setReports(reportsData);
        
        // If user is not a client, fetch clients
        if (authState.user?.role !== "client") {
          const clientsData = await getClients();
          setClients(clientsData.map(client => ({
            id: client.id,
            companyName: client.companyName
          })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load reports data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authState.user?.role, clientId, toast]);
  
  // Set the first report as selected by default
  useEffect(() => {
    if (reports.length > 0 && !selectedReport) {
      setSelectedReport(reports[0]);
    }
  }, [reports, selectedReport]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    // Ensure that type is a valid union type value
    if (name === "type") {
      setFormData((prev) => ({ ...prev, [name]: value as "Dashboard" | "Report" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create reports",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newReport = await createReport(formData, authState.user.id);
      
      if (newReport) {
        toast({
          title: "Report Created",
          description: `${formData.name} has been created successfully.`,
        });
        
        // Add the new report to the list and select it
        setReports(prev => [newReport, ...prev]);
        setSelectedReport(newReport);
        setIsDialogOpen(false);
        
        // Reset form
        setFormData({
          name: "",
          clientId: clientId || "",
          powerBIEmbedUrl: "",
          type: "Dashboard"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create report",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    try {
      const reportToDelete = reports.find(r => r.id === reportId);
      if (!reportToDelete) return;
      
      const success = await deleteReport(reportId);
      
      if (success) {
        toast({
          title: "Report Deleted",
          description: `${reportToDelete.name} has been deleted successfully.`,
        });
        
        // Remove the report from the list
        setReports(prev => prev.filter(r => r.id !== reportId));
        
        // If the deleted report is currently selected, clear the selection
        if (selectedReport?.id === reportId) {
          setSelectedReport(reports.length > 1 ? 
            reports.find(r => r.id !== reportId) || null : null);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete report",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Client users view
  if (authState.user?.role === "client") {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">My Reports</h2>
        
        <ReportsList 
          reports={reports}
          onSelectReport={(report) => setSelectedReport(report)}
          onDeleteReport={() => {}} // Clients can't delete reports
          selectedReportId={selectedReport?.id}
        />
        
        {selectedReport && (
          <ReportViewer 
            report={selectedReport}
            onDelete={() => {}} // Clients can't delete reports
          />
        )}
        
        {reports.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">No Reports Available</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any reports assigned to your account yet.
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Admin and core_user view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {clientId 
            ? `Reports for ${clients.find(c => c.id === clientId)?.companyName || 'Client'}`
            : 'All Reports'}
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              <span>Add New Report</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Report</DialogTitle>
                <DialogDescription>
                  Create a new Power BI report or dashboard for a client
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter report name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {!clientId && clients.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select 
                      value={formData.clientId} 
                      onValueChange={(value) => handleSelectChange("clientId", value)}
                      required
                    >
                      <SelectTrigger id="clientId">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="type">Report Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange("type", value as "Dashboard" | "Report")}
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="Report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="powerBIEmbedUrl">Power BI Embed URL</Label>
                  <Input
                    id="powerBIEmbedUrl"
                    name="powerBIEmbedUrl"
                    placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                    value={formData.powerBIEmbedUrl}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the Power BI embed URL for this report
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Report
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
          <p className="text-muted-foreground mb-4">
            {clientId 
              ? "This client doesn't have any reports yet. Add one to get started."
              : "No reports found. Add a new report to get started."}
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>Add New Report</Button>
        </div>
      ) : (
        <>
          <ReportsList 
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onDeleteReport={handleDeleteReport}
            selectedReportId={selectedReport?.id}
            showClientInfo={!clientId}
            clientNames={clientNames}
          />
          
          {selectedReport && (
            <ReportViewer 
              report={selectedReport}
              onDelete={handleDeleteReport}
              clientName={clientNames[selectedReport.clientId]}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
