"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc,
  deleteDoc, doc, updateDoc, serverTimestamp
} from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

type Task = {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
};

export default function ProjectDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [newTask, setNewTask] = useState({
    title: "",
    status: "Todo" as Task["status"],
    priority: "Medium" as Task["priority"],
    dueDate: "",
  });

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const snap = await getDocs(collection(db, "projects", id as string, "tasks"));
    setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    await addDoc(collection(db, "projects", id as string, "tasks"), {
      ...newTask,
      createdAt: serverTimestamp(),
    });
    setNewTask({ title: "", status: "Todo", priority: "Medium", dueDate: "" });
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "projects", id as string, "tasks", taskId));
    fetchTasks();
  };

  const updateStatus = async (taskId: string, status: Task["status"]) => {
    await updateDoc(doc(db, "projects", id as string, "tasks", taskId), {
      status,
      ...(status === "Done" ? { completedAt: serverTimestamp() } : {}),
    });
    fetchTasks();
  };

  const priorityColor = (p: string) => {
    if (p === "High") return "bg-red-100 text-red-600";
    if (p === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  const filteredTasks = tasks.filter(t => {
    const statusMatch = filter === "All" || t.status === filter;
    const priorityMatch = priorityFilter === "All" || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📋 My Tasks</h1>
        <button
          onClick={() => router.push("/projects")}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Projects
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Tasks</h2>

        {/* ADD TASK */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Task</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-3 gap-3">
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <button
              onClick={addTask}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* STATUS FILTER */}
        <div className="flex gap-2 mb-3">
          {["All", "Todo", "In Progress", "Done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* PRIORITY FILTER */}
        <div className="flex gap-2 mb-6">
          {["All", "Low", "Medium", "High"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                priorityFilter === p ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* TASK LIST */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-400 text-lg">No tasks found!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${task.status === "Done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
                      className="text-sm px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                    >
                      <option>Todo</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}