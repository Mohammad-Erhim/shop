export interface RegisterPayload {
  name: string;
  password: string;
  email: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RefreshTokenPayload {
  refreshToken: string;
}
