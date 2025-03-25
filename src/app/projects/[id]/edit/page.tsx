"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "../../../../../lib/parse";

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("À faire");

  useEffect(() => {
    async function fetchProject() {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      try {
        const result = await query.get(params.id);
        setProject(result);
        setName(result.get("name"));
        setDescription(result.get("description"));
        setDueDate(result.get("dueDate").toISOString().split("T")[0]); 
        setStatus(result.get("status"));
      } catch (error) {
        console.error("Erreur lors du chargement du projet", error);
      }
    }
    fetchProject();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      project.set("name", name);
      project.set("description", description);
      project.set("dueDate", new Date(dueDate));
      project.set("status", status);
      await project.save();
      router.push(`/projects/${params.id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet", error);
    }
  };

  if (!project) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Modifier le projet</h1>
      <form onSubmit={handleUpdate}>
        <label>Nom :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Date d'échéance :</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label>Status :</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
