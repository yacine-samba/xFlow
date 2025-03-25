'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "../../.././../lib/parse";
import Modal from "@/components/Modal/Modal";
import "../projects.scss";

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);


  useEffect(() => {
    async function fetchProject() {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      try {
        const result = await query.get(params.id);
        setProject(result);
      } catch (error) {
        console.error("Erreur lors du chargement du projet", error);
      }
    }
    fetchProject();
  }, [params.id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      const project = await query.get(params.id);
      await project.destroy();
      router.push("/projects");
    } catch (error) {
      console.error("Erreur lors de la suppression du projet", error);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  if (!project) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{project.get("name")}</h1>
      <p>{project.get("description")}</p>
      <p>Échéance : {project.get("dueDate").toLocaleDateString()}</p>
      <p>Status : {project.get("status")}</p>

      <button onClick={() => router.push(`/projects/${params.id}/edit`)} 
      className="editButton">
        Modifier
      </button>
      <button onClick={() => setConfirmDelete(true)}
      className="deleteButton">Supprimer</button>

      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Supprimer le projet"
        message="Es-tu sûr de vouloir supprimer ce projet ? Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}