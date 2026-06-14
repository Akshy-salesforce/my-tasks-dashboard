"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  addDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  createdAt: any;
};

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const snap = await getDocs(
      query(collection(db, "projects"), where("userId", "==", user!.uid))
    );
    setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    setLoading(false);
  };

  const addProject = async () => {
    if (!newProject.trim()) return;
    await addDoc(collection(db, "projects"), {
      name: newProject.trim(),
      userId: user!.uid,
      createdAt: serverTimestamp(),
    });
    setNewProject("");
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📋 My Tasks</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h2>

        {/* ADD PROJECT */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="New project name..."
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addProject(); }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Add
          </button>
        </div>

        {/* PROJECT LIST */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-400 text-lg">No projects yet!</p>
            <p className="text-gray-400 text-sm mt-2">Create your first project above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow p-5 flex justify-between items-center hover:shadow-md transition-all"
              >
                <div
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="cursor-pointer flex-1"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-400">
                    Created: {project.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-all ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}