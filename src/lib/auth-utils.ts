import { JwtPayload } from "@/model/jwt-payload.model";
import { CurrentUser, UserResponse } from "@/model/user.model";

export class AuthUtils {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'current_user';

  // Decode JWT token
  static decodeToken(token?: string): JwtPayload | null {
    const authToken = token || this.getToken();
    if (!authToken) return null;

    try {
      const parts = authToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      let payload = parts[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding
      switch (payload.length % 4) {
        case 2: payload += '=='; break;
        case 3: payload += '='; break;
      }

      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      return null;
    }
  }

  // Get token from localStorage
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Save token to localStorage
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Get current user from localStorage
  static getCurrentUser(): CurrentUser | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Save user to localStorage
  static setCurrentUser(user: CurrentUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static removeCurrentUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return !!this.getToken();
  }

  static hasRole(role: string): boolean {
    const decoded = this.decodeToken();
    return decoded?.realm_access?.roles.includes(role) || false;
  }

  static isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  static isManager(): boolean {
    return this.hasRole('MANAGER');
  }

  static isUser(): boolean {
    return this.hasRole('USER');
  }

  static logout(): void {
    this.removeToken();
    this.removeCurrentUser();
  }
}