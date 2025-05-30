
export type UserRole = "admin" | "core_user" | "client";
export type SubscriptionPlan = "free" | "professional" | "enterprise";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  companyName?: string;
  businessType?: string;
  createdAt: string;
  clientId?: string;
  powerBIEmbedUrl?: string;
  subscription?: SubscriptionPlan;
  subscriptionExpiry?: string;
}

export interface Client {
  id: string;
  companyName: string;
  username: string;
  createdBy: string;
  createdAt: string;
  clientProfileId?: string;
}

export interface Report {
  id: string;
  name: string;
  clientId: string;
  powerBIEmbedUrl: string;
  type: "Dashboard" | "Report";
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface CoreUserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  business_type: string;
  company_name: string;
}

export interface ClientRegistration {
  companyName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ReportCreation {
  name: string;
  clientId: string;
  powerBIEmbedUrl: string;
  type: "Dashboard" | "Report";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  clientLimit: number;
  reportLimit: number;
  highlighted?: boolean;
}
