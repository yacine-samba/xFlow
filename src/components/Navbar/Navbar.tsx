'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Parse from '../../../lib/parse';
import { Bell, Search } from 'lucide-react';
import './Navbar.scss';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<Parse.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserSession = useCallback(async () => {
    try {
      const currentUser = await Parse.User.currentAsync();

      if (!currentUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const sessionQuery = new Parse.Query(Parse.Session);
        sessionQuery.equalTo("sessionToken", currentUser.getSessionToken());
        const validSession = await sessionQuery.first();

        if (validSession) {
          setUser(currentUser);
        } else {
          await Parse.User.logOut();
          setUser(null);
        }
      } catch (sessionError) {
        console.error('Erreur lors de la vérification de la session:', sessionError);
        await Parse.User.logOut();
        setUser(null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();

    const intervalId = setInterval(checkUserSession, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkUserSession]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await Parse.User.logOut();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handleRegisterRedirect = () => {
    router.push('/auth/register');
  };

  const handleCreateProjectRedirect = () => {
    router.push('/projects/new');
  };

  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar__container">
          <Link href="/" className="navbar__brand">xFlow</Link>
          <div className="navbar__auth">
            <div className="loading">Chargement...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <Link href="/" className="navbar__brand">xFlow</Link>

          {user && (
            <>
              <div className="navbar__profile">
                <div className="navbar__profile-icon">
                  {user.get('username')[0].toUpperCase()}
                </div>
              </div>
              <div className="navbar__nav">
                <ul>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="navbar__right">

          <div className="navbar__actions">
            {user ? (
              <>

                <div className="navbar__search">
                  <input type="text" placeholder="Rechercher..." className="navbar__search__input" />
                  <Search className="navbar__search-icon" />
                </div>
                <button className="navbar__button create" onClick={handleCreateProjectRedirect}>
                  Créer un projet
                </button>
                <button className="navbar__button logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button className="navbar__button login" onClick={handleLoginRedirect}>
                  Connexion
                </button>
                <button className="navbar__button signup" onClick={handleRegisterRedirect}>
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
