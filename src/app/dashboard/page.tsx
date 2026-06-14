"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    completedThisWeek: 0,
    overdue: 0,
  });
  const [chartData, setChartData] = useState([
    { status: "Todo", count: 0 },
    { status: "In Progress", count: 0 },
    { status: "Done", count: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const projectsSnap = await getDocs(
        query(collection(db, "projects"), where("userId", "==", user!.uid))
      );

      let total = 0;
      let completedThisWeek = 0;
      let overdue = 0;
      let todo = 0;
      let inProgress = 0;
      let done = 0;

      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      for (const project of projectsSnap.docs) {
        const tasksSnap = await getDocs(
          collection(db, "projects", project.id, "tasks")
        );
        tasksSnap.docs.forEach((task) => {
          const data = task.data();
          total++;

          if (data.status === "Todo") todo++;
          if (data.status === "In Progress") inProgress++;
          if (data.status === "Done") {
            done++;
            const completedAt = data.completedAt?.toDate();
            if (completedAt && completedAt >= weekAgo) completedThisWeek++;
          }

          if (data.status !== "Done" && data.dueDate) {
            const due = new Date(data.dueDate);
            if (due < now) overdue++;
          }
        });
      }

      setStats({ total, completedThisWeek, overdue });
      setChartData([
        { status: "Todo", count: todo },
        { status: "In Progress", count: inProgress },
        { status: "Done", count: done },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            onClick={() => router.push("/projects")}
            className="text-blue-600 hover:underline font-medium"
          >
            Projects
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Welcome, {user?.email} 👋
        </h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Total Tasks</p>
            <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Completed This Week</p>
            <p className="text-4xl font-bold text-green-600">{stats.completedThisWeek}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Overdue</p>
            <p className="text-4xl font-bold text-red-500">{stats.overdue}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks by Status</h3>
          {stats.total === 0 ? (
            <p className="text-gray-400 text-center py-8">No tasks yet. Create a project to get started!</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}