// app/types/auth.ts (or wherever your types are defined)

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    client_id: string;
    name: string;
    email: string;
    phone?: string;
    is_first_login: boolean;
    force_password_change: boolean;
  };
  refreshToken: string;
  requires_password_change: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken?: () => Promise<boolean>;
}