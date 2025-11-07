// Session management utilities
export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
  timestamp: number;
  expiresAt: number;
}

export class SessionManager {
  private static readonly SESSION_KEY = 'lavare_user_session';
  private static readonly LAST_USER_KEY = 'lavare_last_user';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Save user session to localStorage
  static saveSession(user: any): void {
    const session: UserSession = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      // Also save as last user for quick login
      localStorage.setItem(this.LAST_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  // Get current session if valid
  static getSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session: UserSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.warn('Failed to get session:', error);
      return null;
    }
  }

  // Clear session
  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }

  // Check if user is logged in
  static isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  // Get current user
  static getCurrentUser() {
    const session = this.getSession();
    return session?.user || null;
  }

  // Extend session expiry (refresh on activity)
  static refreshSession(): void {
    const session = this.getSession();
    if (session) {
      session.expiresAt = Date.now() + this.SESSION_DURATION;
      this.saveSession(session.user);
    }
  }

  // Get last user (for quick login)
  static getLastUser() {
    try {
      const userData = localStorage.getItem(this.LAST_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to get last user:', error);
      return null;
    }
  }
}