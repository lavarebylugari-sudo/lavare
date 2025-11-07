// OAuth utility for Google authentication
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export class GoogleAuth {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';
    this.redirectUri = window.location.origin + '/auth/callback';
  }

  // Generate the Google OAuth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  // Handle the callback and extract user info from URL parameters
  async handleCallback(): Promise<GoogleUser | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      console.error('No authorization code found');
      return null;
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return null;
    }
  }

  // Start the OAuth flow
  signIn(): void {
    window.location.href = this.getAuthUrl();
  }
}