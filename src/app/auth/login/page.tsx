'use client';

import { useState, useEffect } from 'react';
import Parse from '../../../../lib/parse';
import { useRouter } from 'next/navigation';

import '../auth.scss';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<Parse.User | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser && currentUser.getSessionToken()) {
          // Vérifier si la session est valide
          const sessionQuery = new Parse.Query(Parse.Session);
          sessionQuery.equalTo("sessionToken", currentUser.getSessionToken());
          const validSession = await sessionQuery.first();

          if (validSession) {
            console.log('Utilisateur déjà connecté:', currentUser);

            router.push('/dashboard');
          } else {
            await Parse.User.logOut();
            console.log('Session invalide, utilisateur déconnecté');
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la session:', err);
      }
    };

    checkUserSession();
  }, [router]);




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Tous les champs doivent être remplis');
    } else {
      setError('');
      try {
        const user = await Parse.User.logIn(email, password);

        console.log('Utilisateur connecté:', user);

        setUser(user);

        setTimeout(() => {
          console.log('Redirection vers Dashboard');
          router.push('/dashboard');
        }, 2000);
      } catch (err: any) {
        setError('Erreur de connexion : ' + err.message);
      }
    }
  };


  return (
    <div className="auth-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Se connecter
        </button>
      </form>
      <p className='link'>
        Vous n'avez pas de compte ? <Link href="/auth/register">Inscrivez-vous</Link>
      </p>
    </div>
  );
}
