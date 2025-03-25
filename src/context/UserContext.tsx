'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import Parse from '../../lib/parse';

interface UserContextType {
  user: Parse.User | null;
  setUser: React.Dispatch<React.SetStateAction<Parse.User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<Parse.User | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la session:', err);
        setUser(null);
      }
    };
    checkUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
