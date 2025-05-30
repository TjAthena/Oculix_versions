
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Report } from "@/types";

interface ReportViewerProps {
  report: Report;
  onDelete: (reportId: string) => void;
  clientName?: string;
}

const ReportViewer = ({ report, onDelete, clientName }: ReportViewerProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{report.name}</CardTitle>
          <CardDescription>
            {clientName && `${clientName} - `}{report.type}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(report.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Report
        </Button>
      </CardHeader>
      <CardContent className="p-0 h-[70vh]">
        <iframe 
          src={report.powerBIEmbedUrl} 
          width="100%" 
          height="100%" 
          allowFullScreen 
          title={report.name}
          className="border-0"
        />
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
