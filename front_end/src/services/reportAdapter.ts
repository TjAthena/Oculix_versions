
import { reportsAPI } from "@/integrations/api/client";
import { Report, ReportCreation } from "@/types";

export async function getReports(clientId?: string): Promise<Report[]> {
  try {
    const response = await reportsAPI.getReports(clientId);
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      clientId: item.client_id,
      powerBIEmbedUrl: item.power_bi_embed_url,
      type: item.type || "Report",
      createdAt: item.created_at || '',
      createdBy: item.created_by,
      updatedAt: item.updated_at || undefined
    }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getReportById(id: string): Promise<Report | null> {
  try {
    const response = await reportsAPI.getReport(id);
    const report = response.data;
    
    return {
      id: report.id,
      name: report.name,
      clientId: report.client_id,
      powerBIEmbedUrl: report.power_bi_embed_url,
      type: report.type || "Report",
      createdAt: report.created_at || '',
      createdBy: report.created_by,
      updatedAt: report.updated_at || undefined
    };
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}

export async function createReport(report: ReportCreation, userId: string): Promise<Report | null> {
  try {
    const response = await reportsAPI.createReport({
      name: report.name,
      client_id: report.clientId,
      power_bi_embed_url: report.powerBIEmbedUrl,
      type: report.type,
      created_by: userId
    });
    
    const newReport = response.data;
    return {
      id: newReport.id,
      name: newReport.name,
      clientId: newReport.client_id,
      powerBIEmbedUrl: newReport.power_bi_embed_url,
      type: newReport.type || "Report",
      createdAt: newReport.created_at || '',
      createdBy: newReport.created_by,
      updatedAt: newReport.updated_at || undefined
    };
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
}

export async function updateReport(id: string, updates: Partial<Report>): Promise<boolean> {
  try {
    await reportsAPI.updateReport(id, {
      name: updates.name,
      power_bi_embed_url: updates.powerBIEmbedUrl,
      type: updates.type
    });
    return true;
  } catch (error) {
    console.error("Error updating report:", error);
    return false;
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  try {
    await reportsAPI.deleteReport(id);
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    return false;
  }
}
