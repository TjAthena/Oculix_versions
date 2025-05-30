import { authAPI } from "@/integrations/api/client";
import { User, CoreUserRegistration } from "@/types";

export async function loginUser(email: string, password: string): Promise<{user: User | null, success: boolean}> {
  try {
    const response = await authAPI.login(email, password);
    if (response.data.token) {
      // Store both the access token and refresh token
      localStorage.setItem('authToken', response.data.token);
      
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      
      return { user: response.data.user, success: true };
    }
    return { user: null, success: false };
  } catch (error) {
    console.error("Login error:", error);
    return { user: null, success: false };
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    // Get the refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Only call logout if we have a refresh token
    if (refreshToken) {
      await authAPI.logout();
    }
    
    // Always clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

export async function registerUser(userData: CoreUserRegistration): Promise<boolean> {
  try {
    const response = await authAPI.register(userData);
    return !!response.data.success;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const response = await authAPI.getUser();
    return response.data as User;
  } catch (error) {
    console.error("Get current user error:", error);
    localStorage.removeItem('authToken');
    return null;
  }
}

export async function getUserCounts(): Promise<any> {
  try {
    const response = await authAPI.getUserCounts();
    return response.data;
  } catch (error) {
    console.error("Get user counts error:", error);
    return null;
  }
}
