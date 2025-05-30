
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Report } from "@/types";

interface ReportsListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onDeleteReport: (reportId: string) => void;
  selectedReportId?: string;
  showClientInfo?: boolean;
  clientNames?: { [key: string]: string };
}

const ReportsList = ({ 
  reports, 
  onSelectReport, 
  onDeleteReport,
  selectedReportId,
  showClientInfo = false,
  clientNames = {}
}: ReportsListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card 
          key={report.id} 
          className={`overflow-hidden cursor-pointer transition-all ${selectedReportId === report.id ? 'ring-2 ring-powerbi-blue' : ''}`}
          onClick={() => onSelectReport(report)}
        >
          <div className="bg-powerbi-blue h-1"></div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary mt-0.5">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-semibold">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                  {showClientInfo && clientNames[report.clientId] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Client: {clientNames[report.clientId]}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteReport(report.id);
                }}
              >
                <Trash size={16} />
              </Button>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectReport(report);
                }}
              >
                View Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
