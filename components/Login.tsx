import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587495034177-33084323956a?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="absolute inset-0 bg-[#333333] bg-opacity-60"></div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-[#FDF8F0] bg-opacity-90 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold text-[#333333]">
            LAVARE
          </h1>
          <p className="mt-2 text-gray-600">Client Privé Portal</p>
          <div className="mt-6 flex flex-wrap justify-center items-center text-xs text-gray-500 tracking-wider uppercase">
            <span>Lugari</span>
            <span className="mx-2 text-[#D4AF37]">&bull;</span>
            <span>App</span>
            <span className="mx-2 text-[#D4AF37]">&bull;</span>
            <span>Vitality</span>
            <span className="mx-2 text-[#D4AF37]">&bull;</span>
            <span>Elegance</span>
            <span className="mx-2 text-[#D4AF37]">&bull;</span>
            <span>Retreat</span>
            <span className="mx-2 text-[#D4AF37]">&bull;</span>
            <span>Innovation</span>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#333333] hover:bg-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;