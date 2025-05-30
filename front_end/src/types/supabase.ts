
// Type definitions for Supabase database tables
export interface ProfileRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'core_user' | 'client' | null;
  phone_number: string | null;
  company_name: string | null;
  business_type: string | null;
  subscription: 'free' | 'professional' | 'enterprise' | null;
  subscription_expiry: string | null;
  created_at: string | null;
}

export interface ClientRow {
  id: string;
  company_name: string;
  username: string;
  created_by: string;
  created_at: string | null;
  client_profile_id: string | null;
}

export interface ReportRow {
  id: string;
  name: string;
  client_id: string;
  power_bi_embed_url: string;
  type: 'Dashboard' | 'Report' | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
}
