'use client'
import { useState } from 'react';
import Parse from '../../../../lib/parse'; 
import { useRouter } from 'next/navigation';

import '../auth.scss';
import Link from 'next/link';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Fonction pour enregistrer un utilisateur
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = new Parse.User();
    user.set('username', username);
    user.set('email', email);
    user.set('password', password);

    try {
      await user.signUp();
      setSuccess('Utilisateur créé avec succès !');
      setTimeout(() => {
        console.log('Redirection vers /auth/login');
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError('Erreur lors de la création de l\'utilisateur : ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Inscription</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">S'inscrire</button>
      </form>
      <p>
        Vous avez déja un compte ? <Link href="/auth/login">Connectez-vous</Link>
      </p>
    </div>
  );
};

export default Register;
