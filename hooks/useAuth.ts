
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would call your backend
      const foundUser = mockUsers.find(u => u.username === username);
      if (foundUser) {
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Mock registration
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        isAdmin: false,
        totalPoints: 0,
        weeklyPoints: 0,
        createdAt: new Date()
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.log('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
};
