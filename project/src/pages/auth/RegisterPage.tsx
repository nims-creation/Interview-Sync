import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');
  const { register, error, clearError, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const { signInWithGoogle } = useGoogleAuth();
  const navigate = useNavigate();
  
  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      addNotification({ 
        type: 'success', 
        title: 'Registration Successful', 
        message: 'Your account has been created successfully with Google.'
      });
      navigate('/candidate/dashboard'); // Default to candidate dashboard
    } catch (err) {
      addNotification({ 
        type: 'error', 
        title: 'Google Sign-up Failed', 
        message: 'Failed to sign up with Google. Please try again.'
      });
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await register(email, password, name, role);
      addNotification({ 
        type: 'success', 
        title: 'Registration Successful', 
        message: 'Your account has been created successfully.'
      });
      navigate(role === 'candidate' ? '/candidate/dashboard' : '/interviewer/dashboard');
    } catch (err) {
      // Error is already set in the auth context
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-card p-8 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white animate-fade-in-delay">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-secondaryText animate-fade-in-delay-2">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 dark:text-primary-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              sign in to your existing account
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
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) clearError();
                  }}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-inputBorder placeholder-gray-500 dark:placeholder-secondaryText text-gray-900 dark:text-white bg-white dark:bg-neutral-800 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-secondaryText" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-inputBorder placeholder-gray-500 dark:placeholder-secondaryText text-gray-900 dark:text-white bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-secondaryText" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-inputBorder placeholder-gray-500 dark:placeholder-secondaryText text-gray-900 dark:text-white bg-white dark:bg-neutral-800 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`${
                  role === 'candidate'
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-white dark:bg-neutral-800 border-gray-300 dark:border-inputBorder text-gray-700 dark:text-secondaryText hover:bg-gray-50 dark:hover:bg-neutral-700'
                } border rounded-xl py-3 px-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
              >
                <UserCheck className="h-5 w-5 mr-2" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('interviewer')}
                className={`${
                  role === 'interviewer'
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-white dark:bg-neutral-800 border-gray-300 dark:border-inputBorder text-gray-700 dark:text-secondaryText hover:bg-gray-50 dark:hover:bg-neutral-700'
                } border rounded-xl py-3 px-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
              >
                <User className="h-5 w-5 mr-2" />
                Interviewer
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Create account
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
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-xs text-gray-500 dark:text-secondaryText text-center">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;