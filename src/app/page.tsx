'use client'
import { useEffect, useState } from 'react'
import Parse from '../../lib/parse'
import { ArrowRight, Boxes, CheckCircle, Clock, FileText, Users, Zap } from 'lucide-react';
import Link from 'next/link';
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

  const features = [
    {
      icon: <Boxes className="icon" />,
      title: "Gestion de Projets",
      description: "Créez et gérez vos projets en toute simplicité avec une interface intuitive."
    },
    {
      icon: <FileText className="icon" />,
      title: "Gestion Documentaire",
      description: "Attachez et organisez tous vos documents importants directement dans vos projets."
    },
    {
      icon: <Users className="icon" />,
      title: "Collaboration d'Équipe",
      description: "Invitez des membres et travaillez ensemble efficacement sur vos projets."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="icon" />,
      title: "Gain de temps",
      description: "Automatisez vos processus et gagnez en efficacité."
    },
    {
      icon: <CheckCircle className="icon" />,
      title: "Simple à utiliser",
      description: "Interface intuitive pour une prise en main rapide."
    },
    {
      icon: <Zap className="icon" />,
      title: "Performance",
      description: "Application rapide et réactive pour votre productivité."
    }
  ];


  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Simplifiez la gestion de vos projets avec <span className="text-primary">XFlow</span>
        </h1>
        <p className="hero-subtitle">
          {isAuthenticated
            ? "Accédez à tous vos projets et fonctionnalités pour une gestion efficace."
            : "La plateforme qui simplifie la collaboration et la gestion de projets pour les équipes modernes."}
        </p>
        <div className="hero-actions">
          <Link href='/auth/register' className="button-primary">
            Commencer maintenant
            <ArrowRight className="icon" />
          </Link>
          <Link href='#features' className="button-secondary">
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id='features'>
        {features.map((feature, index) => (
          <div key={index} className="features-item">
            <div className="icon-container">{feature.icon}</div>
            <h3 className="title">{feature.title}</h3>
            <p className="description">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-container">
          <h2 className="benefits-title">Pourquoi choisir XFlow ?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefits-item">
                <div className="icon-container">{benefit.icon}</div>
                <div className="info">
                  <h3 className="title">{benefit.title}</h3>
                  <p className="description">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
