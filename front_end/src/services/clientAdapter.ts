
import { clientsAPI } from "@/integrations/api/client";
import { Client } from "@/types";

export async function getClients(): Promise<Client[]> {
  try {
    const response = await clientsAPI.getClients();
    return response.data.map((client: any) => ({
      id: client.id,
      companyName: client.company_name,
      username: client.username,
      createdBy: client.created_by,
      createdAt: client.created_at || '',
      clientProfileId: client.client_profile_id
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const response = await clientsAPI.getClient(id);
    const client = response.data;
    
    return {
      id: client.id,
      companyName: client.company_name,
      username: client.username,
      createdBy: client.created_by,
      createdAt: client.created_at || '',
      clientProfileId: client.client_profile_id
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<boolean> {
  try {
    await clientsAPI.updateClient(id, {
      company_name: updates.companyName,
      username: updates.username
    });
    return true;
  } catch (error) {
    console.error("Error updating client:", error);
    return false;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await clientsAPI.deleteClient(id);
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    return false;
  }
}

export async function getClientReportCount(clientId: string): Promise<number> {
  try {
    const response = await clientsAPI.getClientReportCount(clientId);
    return response.data.count || 0;
  } catch (error) {
    console.error("Error counting reports:", error);
    return 0;
  }
}
