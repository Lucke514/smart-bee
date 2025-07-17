import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import { checkActiveSession, User } from './services/auth.service';
import LoadingScreen from './components/loading-screen';
import Login from './components/login';
import MainApp from './components/main-app';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const activeUser = await checkActiveSession();
      
      if (activeUser) {
        setUser(activeUser);
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setAuthState('unauthenticated');
    }
  };

  const handleLoginSuccess = () => {
    checkSession();
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState('unauthenticated');
  };

  if (authState === 'loading') {
    return (
      <>
        <LoadingScreen />
        <StatusBar style="auto" />
      </>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <MainApp user={user!} onLogout={handleLogout} />
      <StatusBar style="auto" />
    </>
  );
}
