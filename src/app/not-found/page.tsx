'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000); 
  }, [router]);

  return (
    <div>
      <h1>Page non trouvée</h1>
      <p>Vous allez être redirigé vers la page d&apos;accueil...</p>
    </div>
  );
};

export default Custom404;
