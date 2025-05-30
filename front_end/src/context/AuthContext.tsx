import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User, UserRole, SubscriptionPlan, CoreUserRegistration, ClientRegistration } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: CoreUserRegistration) => Promise<boolean>;
  createClient: (clientData: ClientRegistration) => Promise<boolean>;
  upgradeSubscription: (plan: SubscriptionPlan) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  const { toast } = useToast();

 useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Verify the token with the backend
      fetch('http://127.0.0.1:8000/api/auth/user/', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data?.email) {
            setAuthState({
              user: data,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setAuthState({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  // Login function
 const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns a user object and a token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('refreshToken', data.refresh);
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          loading: false,
        });

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        return true;
      } else {
        const data = await response.json();
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);

      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Register function for core users
  const register = async (userData: CoreUserRegistration): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          phone_number: userData.phone_number,
          business_type: userData.business_type,
          company_name: userData.company_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: data.message || "Registration failed",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);

      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return false;
    }
  };

  // Create client function
 const createClient = async (clientData: ClientRegistration): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast({
          title: "Failed to create client",
          description: "You must be logged in to create a client",
          variant: "destructive",
        });
        return false;
      }

      const { companyName, username, password } = clientData;
      const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

      try {
        const response = await fetch(`${API_URL}/api/clients/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ companyName, username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast({
            title: "Failed to create client",
            description: data.message || "Failed to create client",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Client created",
          description: `${clientData.companyName} has been successfully registered`,
        });

        return true;
      } catch (error) {
        console.error("Create client error:", error);
        toast({
          title: "Failed to create client",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Create client error:", error);
      toast({
        title: "Failed to create client",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Upgrade subscription function
  const upgradeSubscription = async (plan: SubscriptionPlan): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast({
          title: "Failed to upgrade",
          description: "You must be logged in to upgrade your subscription",
          variant: "destructive",
        });
        return false;
      }

      if (authState.user.role !== "core_user") {
        toast({
          title: "Failed to upgrade",
          description: "Only core users can upgrade their subscription",
          variant: "destructive",
        });
        return false;
      }

      // In a real app, this would connect to a payment processor and backend API
      const response = await fetch('/api/upgrade_subscription', { // Replace with your Django upgrade subscription endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include token
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Failed to upgrade",
          description: data.message || "Failed to upgrade subscription",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setAuthState(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          subscription: plan,
          subscriptionExpiry: data.subscriptionExpiry
        }
      }));

      toast({
        title: "Subscription upgraded",
        description: `Your subscription has been upgraded to the ${plan} plan.`,
      });

      return true;
    } catch (error) {
      console.error("Upgrade error:", error);

      toast({
        title: "Failed to upgrade",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        register,
        createClient,
        upgradeSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
