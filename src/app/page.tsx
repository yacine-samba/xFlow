'use client'
import { useEffect, useState } from 'react'
import Parse from '../../lib/parse'
const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    Parse.User._clearCache();

    const checkUserSession = async () => {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        console.log('Utilisateur connecté:', currentUser);
      } else {
        console.log('Aucun utilisateur connecté.');
      }
    };

    checkUserSession();
  }, []);

  return (
    <div>
      <h1>Bienvenue sur XFlow </h1>
      <p className="welcome-message">
        {isAuthenticated
          ? "Vous êtes connecté. Accédez à tous vos projets et fonctionnalités."
          : "Connectez-vous pour accéder à toutes les fonctionnalités."}
      </p>
    </div>
  );
};

export default Home;
