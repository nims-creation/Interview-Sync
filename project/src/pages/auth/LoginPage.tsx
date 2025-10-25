import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleAuth, error, clearError, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const { signInWithGoogle } = useGoogleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      addNotification({ 
        type: 'success', 
        title: 'Login Successful', 
        message: 'Welcome back! You have successfully logged in with Google.'
      });
      navigate(from, { replace: true });
    } catch (err) {
      addNotification({ 
        type: 'error', 
        title: 'Google Sign-in Failed', 
        message: 'Failed to sign in with Google. Please try again.'
      });
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      addNotification({ 
        type: 'success', 
        title: 'Login Successful', 
        message: 'Welcome back! You have successfully logged in.'
      });
      navigate(from, { replace: true });
    } catch (err) {
      // Error is already set in the auth context
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-card p-8 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white animate-fade-in-delay">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-secondaryText animate-fade-in-delay-2">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 dark:text-primary-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              register for a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8.414l2.586-2.586a1 1 0 011.414 1.414L11.414 10l2.586 2.586a1 1 0 11-1.414 1.414L10 11.414l-2.586 2.586a1 1 0 11-1.414-1.414L8.586 10 6 7.414a1 1 0 011.414-1.414L10 8.586l2.586-2.586a1 1 0 111.414 1.414L11.414 10z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-inputBorder placeholder-gray-500 dark:placeholder-secondaryText text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-neutral-800 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-inputBorder placeholder-gray-500 dark:placeholder-secondaryText text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-neutral-800 transition-all duration-200"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-500 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-600 dark:text-secondaryText hover:text-gray-900 dark:hover:text-white transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn className="h-5 w-5" />}
              className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              Sign in
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-500"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-card text-gray-600 dark:text-secondaryText">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-gray-50 dark:bg-neutral-800 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 hover:animate-pulse transition-all duration-200"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;