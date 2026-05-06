'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { driversService } from '@/services';
import { Driver, LoginRequest } from '@/types/api';
export function useDriverAuth() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    try {
      const driverData = await driversService.getMe();
      setDriver(driverData);
    } catch (err: any) {
      setError(err.message);
      setDriver(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driversService.login({ email, password });
      if (response.driver) {
        setDriver(response.driver);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await driversService.logout();
      setDriver(null);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    driver,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };
}
