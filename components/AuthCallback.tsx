import React, { useEffect, useState } from 'react';
import { GoogleAuth, GoogleUser } from '../services/authService';

interface AuthCallbackProps {
  onAuthSuccess: (user: GoogleUser) => void;
  onAuthError: (error: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const googleAuth = new GoogleAuth();
        const user = await googleAuth.handleCallback();
        
        if (user) {
          onAuthSuccess(user);
        } else {
          onAuthError('Failed to authenticate with Google');
        }
      } catch (error) {
        onAuthError(error instanceof Error ? error.message : 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [onAuthSuccess, onAuthError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <h2 className="font-display text-2xl text-[#333333] mb-2">Authenticating...</h2>
          <p className="text-gray-600">Please wait while we complete your sign-in</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;