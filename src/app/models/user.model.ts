export interface User {
  id?: string | number;
  email: string;
  password?: string;
  username?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
