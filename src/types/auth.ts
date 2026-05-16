export interface User {

  _id: string;

  name: string;

  email: string;

  role:
    | "admin"
    | "manager"
    | "member";
}
    
  export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
  }