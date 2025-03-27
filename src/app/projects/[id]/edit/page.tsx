"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "../../../../../lib/parse";
import { useUser } from "@/context/UserContext";

export default function EditProject({ params, }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("À faire");
  const [members, setMembers] = useState<any[]>([]); // Ajouter l'état pour les membres
  const [newMemberEmail, setNewMemberEmail] = useState(""); // Email ou username pour ajouter un membre
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]); // Liste des suggestions
  const [searchError, setSearchError] = useState(""); // Erreur de recherche
  const projectParams = use(params);
  const projectId = projectParams.id;

  const user = useUser();


  useEffect(() => {
    if (!projectId || !user) return; // Ne pas exécuter si l'utilisateur n'est pas connecté

    async function fetchProject() {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      query.include("teamMembers");

      try {
        const result = await query.get(projectId);
        setProject(result);
        setName(result.get("name"));
        setDescription(result.get("description"));
        setDueDate(result.get("dueDate").toISOString().split("T")[0]);
        setStatus(result.get("status"));

        // Récupérer les membres du projet via la relation
        const membersRelation = result.relation("teamMembers");
        const membersQuery = membersRelation.query();
        const membersList = await membersQuery.find();

        setMembers(membersList);
      } catch (error) {
        console.error("Erreur lors du chargement du projet", error);
      }
    }

    fetchProject();
  }, [projectId, user]);  // Ajoute 'user' à la dépendance pour redémarrer la récupération en fonction de l'utilisateur connecté

  const handleSearchUsers = async (query: string) => {
    if (!query) {
      setSuggestedUsers([]);
      return;
    }

    const User = Parse.Object.extend("User");
    const queryUser = new Parse.Query(User);

    try {
      const users = await queryUser.find();
      setSuggestedUsers(users);
      if (users.length === 0) {
        setSearchError("Aucun utilisateur trouvé");
      } else {
        setSearchError(""); // Clear error if there are results
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs", error);
      setSearchError("Erreur lors de la recherche");
    }
  };

  const handleAddMember = async (user: any) => {
    if (!user) return;

    try {
      if (!(user instanceof Parse.Object)) {
        const User = Parse.Object.extend("User");
        user = new User(user);
      }

      if (!user.id) {
        await user.save();
      }

      const relation = project.relation("teamMembers");
      relation.add(user);
      await project.save();

      setMembers((prev) => [...prev, user]);
      setNewMemberEmail("");
      setSuggestedUsers([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre", error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const User = Parse.Object.extend("User");
    const queryUser = new Parse.Query(User);
    const user = await queryUser.get(userId);

    if (user) {
      const relation = project.relation("teamMembers");
      relation.remove(user);
      await project.save();
      setMembers((prev) => prev.filter((member) => member.id !== userId));
    } else {
      alert("Utilisateur non trouvé");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      project.set("name", name);
      project.set("description", description);
      project.set("dueDate", new Date(dueDate));
      project.set("status", status);
      await project.save();
      router.push(`/projects/${projectId}`);
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

      <div>
        <h2>Gérer les membres</h2>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={newMemberEmail}
          onChange={(e) => {
            setNewMemberEmail(e.target.value);
            handleSearchUsers(e.target.value);
          }}
        />
        {searchError && <p>{searchError}</p>} {/* Affiche un message d'erreur */}
        <ul>
          {suggestedUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleAddMember(user)}
              style={{ cursor: "pointer", listStyle: "none" }}
            >
              {user.get("username")}
            </li>
          ))}
        </ul>

        <h3>Membres actuels</h3>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              {member.get("username")}
              <button onClick={() => handleRemoveMember(member.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
