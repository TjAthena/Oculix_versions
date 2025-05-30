
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { ClientRow } from "@/types/supabase";

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    
    return (data as ClientRow[]).map(item => ({
      id: item.id,
      companyName: item.company_name,
      username: item.username,
      createdBy: item.created_by,
      createdAt: item.created_at || '',
      clientProfileId: item.client_profile_id
    }));
  } catch (error) {
    console.error("Error in getClients:", error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching client:", error);
      return null;
    }
    
    const row = data as ClientRow;
    return {
      id: row.id,
      companyName: row.company_name,
      username: row.username,
      createdBy: row.created_by,
      createdAt: row.created_at || '',
      clientProfileId: row.client_profile_id
    };
  } catch (error) {
    console.error("Error in getClientById:", error);
    return null;
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clients')
      .update({
        company_name: updates.companyName,
        username: updates.username
      })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating client:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateClient:", error);
    return false;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting client:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteClient:", error);
    return false;
  }
}

// Get report count for a specific client
export async function getClientReportCount(clientId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);
    
    if (error) {
      console.error("Error counting reports:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getClientReportCount:", error);
    return 0;
  }
}
