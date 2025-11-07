import React, { useState, useCallback, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Page } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Booking from './components/Booking';
import Boutique from './components/Boutique';
import AIVision from './components/AIVision';
import AuthCallback from './components/AuthCallback';
import { LAVARE_MEANING } from './constants';
import { GoogleUser } from './services/authService';

const AboutLavareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#FDF8F0] rounded-lg shadow-2xl p-8 max-w-2xl w-full relative transform transition-all duration-300 scale-95 hover:scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#333333] hover:text-[#D4AF37] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="font-display text-3xl md:text-4xl text-[#333333] text-center mb-4">
          The real meaning of the heritage word L.A.V.A.R.E
        </h2>
        <div className="text-center text-gray-700 mb-8 space-y-2">
          <p>
            In Italian, <span className="font-semibold italic">lavare</span> means 'to wash' or 'to bathe'—the very foundation of our craft.
          </p>
          <p>
            For us, it is also a heritage word, an acronym that embodies the values we bring to every treasured client.
          </p>
        </div>
        <div className="space-y-4">
          {LAVARE_MEANING.map(item => (
            <div key={item.letter} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="font-display text-5xl text-[#D4AF37]">{item.letter}.</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#333333]">{item.word}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
         <div className="text-center mt-10">
            <p className="font-display text-3xl text-[#333333]">
                L.A.V.A.R.E 
                <span 
                  className="text-red-600 font-sans font-normal tracking-wider ml-3 text-xl" 
                  style={{ fontVariant: 'small-caps' }}
                >
                  by Lugari
                </span>
            </p>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if we're on the OAuth callback route
  const isAuthCallback = window.location.pathname === '/auth/callback';

  const handleLogin = useCallback(() => setIsLoggedIn(true), []);
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    // Redirect to home after logout
    window.history.pushState({}, '', '/');
  }, []);
  const handleNavigate = useCallback((page: Page) => setCurrentPage(page), []);
  const toggleAboutModal = useCallback(() => setIsAboutModalOpen(prev => !prev), []);

  const handleAuthSuccess = useCallback((userData: GoogleUser) => {
    setUser(userData);
    setIsLoggedIn(true);
    setAuthError(null);
    // Redirect to dashboard after successful auth
    window.history.pushState({}, '', '/');
  }, []);

  const handleAuthError = useCallback((error: string) => {
    setAuthError(error);
    setIsLoggedIn(false);
    setUser(null);
    // Redirect to login page on error
    setTimeout(() => {
      window.history.pushState({}, '', '/');
      setAuthError(null);
    }, 3000);
  }, []);

  // Handle OAuth callback
  if (isAuthCallback) {
    return (
      <AuthCallback 
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
      />
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="font-display text-2xl text-[#333333] mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Booking:
        return <Booking />;
      case Page.Boutique:
        return <Boutique />;
      case Page.AIVision:
        return <AIVision />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen text-[#333333]">
       <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/4691238/4691238-hd_1920_1080_25fps.mp4"
          poster="https://images.pexels.com/photos/4691238/pexels-photo-4691238.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        />
        <div className="absolute inset-0 bg-[#FDF8F0] bg-opacity-90"></div>
      </div>

      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        onAboutClick={toggleAboutModal}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderCurrentPage()}
      </main>
      {isAboutModalOpen && <AboutLavareModal onClose={toggleAboutModal} />}
      <SpeedInsights />
    </div>
  );
};

export default App;