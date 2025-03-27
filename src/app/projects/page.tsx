'use client'
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import Link from 'next/link';
import './projects.scss';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const query = new Parse.Query('Project');
      query.equalTo('owner', Parse.User.current());
      const results = await query.find();
      setProjects(results);
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Mes Projets</h1>
      <Link href="/projects/new">
        Créer un Nouveau Projet
      </Link>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h2 className="text-xl font-semibold">{project.get('name')}</h2>
              <p>{project.get('description')}</p>
              <p>Échéance : {project.get('dueDate').toLocaleDateString()}</p>
              <p>Status : {project.get('status')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun projet créé. Commencez par en créer un !</p>
      )}
    </div>
  );
};

export default Projects;
