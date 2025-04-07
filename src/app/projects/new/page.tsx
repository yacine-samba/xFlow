'use client'

import { useEffect, useState } from 'react';
import Parse from '../../../../lib/parse';
import { useRouter } from 'next/navigation';

const NewProject = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('À faire');

  useEffect(() => {
    const checkUserSession = async () => {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        router.push('/not-found');
      }
    };

    checkUserSession();
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Project = Parse.Object.extend('Project');
    const project = new Project();

    project.set('name', name);
    project.set('description', description);
    project.set('dueDate', new Date(dueDate));
    project.set('status', status);
    project.set('owner', Parse.User.current());

    try {
      await project.save();
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création du projet : ', error);
    }
  };

  return (
    <div>
      <h1>Créer un Nouveau Projet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom du projet</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dueDate">Date d&apos;échéance</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>
        <button type="submit">
          Créer le Projet
        </button>
      </form>
    </div>
  );
};

export default NewProject;
