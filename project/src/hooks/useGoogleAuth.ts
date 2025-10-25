import { useEffect, useCallback } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleCredentialResponse {
  credential: string;
}

export const useGoogleAuth = () => {
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
        // cspell:disable-next-line
        client_id: '641140398285-utmhqrm4bpil5d97or854l9lg0crl42f.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
      }
    };

    // Wait for Google script to load
    const checkGoogleLoaded = () => {
      if (window.google) {
        initializeGoogleAuth();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      const result = await axios.post('http://localhost:5000/api/google/google', {
        token: response.credential
      });

      if (result.data.success) {
        const { user, token } = result.data.data;
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        // Trigger a page reload to update the auth context
        window.location.reload();
        
        return { success: true, user, token };
      }
    } catch (error: any) {
      console.error('Google authentication error:', error);
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
  }, []);

  const signInWithGoogle = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  }, []);

  return { signInWithGoogle, handleCredentialResponse };
};

