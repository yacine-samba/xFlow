'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import Parse from '../../lib/parse';  // Assurez-vous d'importer correctement Parse

// Création du contexte
interface UserContextType {
  user: Parse.User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

// Composant Provider qui sera utilisé pour fournir l'utilisateur
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserSession() {
      try {
        const currentUser = await Parse.User.currentAsync();
        setUser(currentUser);  // Met à jour l'état de l'utilisateur
      } catch (error) {
        console.error('Erreur de session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkUserSession();  // Vérifie la session de l'utilisateur à chaque montée du composant
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour accéder à l'utilisateur
export const useUser = () => useContext(UserContext);
