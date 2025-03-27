'use client';
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Parse from "../../.././../lib/parse";
import Modal from "@/components/Modal/Modal";
import { Search, UserPlus, Trash } from "lucide-react"; // Icons
import "../projects.scss";

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [searchError, setSearchError] = useState("");
  const projectParams = use(params);
  const projectId = projectParams.id;

  useEffect(() => {
    if (!projectId) return;
    async function fetchProject() {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      query.include("owner");
      try {
        const result = await query.get(projectId);
        setProject(result);

        // Récupérer les membres de l'équipe
        const teamQuery = new Parse.Query("_User");
        teamQuery.equalTo("$relatedTo", {
          object: {
            __type: "Pointer",
            className: "Project",
            objectId: projectId
          },
          key: "teamMembers"
        });

        const members = await teamQuery.find();
        setTeamMembers(members);
      } catch (error) {
        console.error("Erreur lors du chargement du projet", error);
      }
    }

    fetchProject();
  }, [projectId]);

  const handleSearchUsers = async (query: string) => {
    if (!query) {
      setSuggestedUsers([]);
      return;
    }

    const User = Parse.Object.extend("User");
    const queryUser = new Parse.Query(User);
    queryUser.contains("username", query); // Recherche floue

    try {
      const users = await queryUser.find();
      setSuggestedUsers(users);
      setSearchError(users.length === 0 ? "Aucun utilisateur trouvé" : "");
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs", error);
      setSearchError("Erreur lors de la recherche");
    }
  };

  const handleAddMember = async (user: any) => {
    if (!user || !project) return;

    try {
      const relation = project.relation("teamMembers");
      relation.add(user);
      await project.save();

      setTeamMembers((prev) => [...prev, user]);
      setSuggestedUsers([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre", error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!project) return;

    try {
      const User = Parse.Object.extend("User");
      const queryUser = new Parse.Query(User);
      const user = await queryUser.get(userId);

      if (user) {
        const relation = project.relation("teamMembers");
        relation.remove(user);
        await project.save();

        setTeamMembers((prev) => prev.filter((member) => member.id !== userId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
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
      trash
      <h2>Équipe du projet :</h2>
      <ul>
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <li key={member.id}>
              {member.get("username")}{" "}
              {project.get("owner")?.id === member.id && <strong>(Créateur)</strong>}
              {project.get("owner")?.id !== member.id && (
                <button onClick={() => handleRemoveMember(member.id)} className="deleteButton__icon">
                  <Trash size={16} /></button>
              )}
            </li>
          ))
        ) : (
          <p>Aucun membre dans l'équipe.</p>
        )}
      </ul>

      <h3>Ajouter un membre :</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchUsers(e.target.value);
          }}
        />
        <Search size={16} />
      </div>

      {searchError && <p className="error-message">{searchError}</p>}

      <ul className="suggested-users">
        {suggestedUsers.map((user) => (
          <li key={user.id} onClick={() => handleAddMember(user)}>
            {user.get("username")} <UserPlus size={16} />
          </li>
        ))}
      </ul>

      <button onClick={() => router.push(`/projects/${projectId}/edit`)}
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
