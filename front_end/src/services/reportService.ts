
import { supabase } from "@/integrations/supabase/client";
import { Report, ReportCreation } from "@/types";
import { ReportRow } from "@/types/supabase";

export async function getReports(clientId?: string): Promise<Report[]> {
  try {
    let query = supabase.from('reports').select('*');
    
    // Filter by client ID if provided
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
    
    return (data as ReportRow[]).map(item => ({
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
    console.error("Error in getReports:", error);
    return [];
  }
}

export async function getReportById(id: string): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching report:", error);
      return null;
    }
    
    const report = data as ReportRow;
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
    console.error("Error in getReportById:", error);
    return null;
  }
}

export async function createReport(report: ReportCreation, userId: string): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        name: report.name,
        client_id: report.clientId,
        power_bi_embed_url: report.powerBIEmbedUrl,
        type: report.type,
        created_by: userId
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating report:", error);
      return null;
    }
    
    const newReport = data as ReportRow;
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
    console.error("Error in createReport:", error);
    return null;
  }
}

export async function updateReport(id: string, updates: Partial<Report>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reports')
      .update({
        name: updates.name,
        power_bi_embed_url: updates.powerBIEmbedUrl,
        type: updates.type
      })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating report:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateReport:", error);
    return false;
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting report:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteReport:", error);
    return false;
  }
}
