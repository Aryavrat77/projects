import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

const checkAuth = (pathname: string): boolean => {
  if (pathname === '/' || pathname === '/sign-up') {
    return true;
  }

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    window.location.href = '/';
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const expiration = decodedToken.exp ?? 0;
    if (expiration * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
      localStorage.setItem('expired','true')
      window.location.href = '/';
      return false;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
    return false;
  }

  return true;
};


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleDashboardRedirect = () => {
    if (router.pathname === '/dashboard') {
      const employeeId = localStorage.getItem('employeeId');
      if (employeeId) {
        router.push(`/dashboard?id=${employeeId}`);
      }
    }
  };

  useEffect(() => {
    const isAuthenticated = checkAuth(router.pathname);
    setIsAuthenticated(isAuthenticated);
    setIsLoading(false);
    if (isAuthenticated) {
      handleDashboardRedirect();
    }
  }, [router.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component {...pageProps} />;
}

export default MyApp;