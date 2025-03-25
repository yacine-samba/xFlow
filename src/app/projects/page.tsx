'use client'
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import Link from 'next/link';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Projets</h1>
      <Link href="/projects/new" className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Créer un Nouveau Projet
      </Link>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="border-b py-2">
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
