'use client'
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { useRouter } from 'next/navigation';
import './dashboard.scss';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        router.push('/auth/login');
      } else {
        const fetchProjects = async () => {
          const query = new Parse.Query('Project');
          query.equalTo('owner', currentUser);
          const results = await query.find();
          setProjects(results);
        };

        fetchProjects();
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <div className="dashboard__container">
      <div className="dashboard__header">
        <h1>Mes Projets</h1>
        <Link href="/projects/new" className="btn-create-project">Créer un Nouveau Projet</Link>
      </div>

      <div className="dashboard__projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="dashboard__project-card" key={project.id}>
              <div className="dashboard__project-card-header">
                <h2>{project.get('name')}</h2>
                <span>{project.get('status')}</span>
              </div>
              <p>{project.get('description')}</p>
              <p>Échéance : {project.get('dueDate').toLocaleDateString()}</p>
              <Link href={`/projects/${project.id}`} className="btn-view-details">Voir les détails</Link>
            </div>
          ))
        ) : (
          <p className="dashboard__no-projects">Aucun projet créé. <Link href="/projects/new">Créez-en un ici !</Link></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
