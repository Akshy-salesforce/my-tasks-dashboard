"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) return JSON.parse(savedTasks);
    }
    return [
      { title: "Design Dashboard UI", completed: true },
      { title: "Create Login Page", completed: true },
      { title: "Implement Authentication", completed: true },
      { title: "Connect API", completed: false },
      { title: "Deploy App", completed: false },
    ];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { title: newTask.trim(), completed: false }]);
    setNewTask("");
  };

  const deleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  const toggleTask = (indexToToggle) => {
    setTasks(tasks.map((task, index) =>
      index === indexToToggle ? { ...task, completed: !task.completed } : task
    ));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>📋 Task Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.grid}>
        <Card title="Total Tasks" value={totalTasks} />
        <Card title="Completed" value={completedTasks} />
        <Card title="Pending" value={pendingTasks} />
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span>Task Progress</span>
          <span>{progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      <div style={styles.listBox}>
        <h2 style={styles.subHeading}>Recent Tasks</h2>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>Add Task</button>
        </div>

        <ul style={styles.list}>
          {tasks.map((task, index) => (
            <li key={index} style={styles.taskRow}>
              <span style={{
                ...styles.listItem,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6b7280" : "#111827",
              }}>
                {task.title}
              </span>
              <div style={styles.buttonGroup}>
                <button onClick={() => toggleTask(index)} style={styles.completeButton}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => deleteTask(index)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

const styles = {
  page: { padding:"30px", minHeight:"100vh", backgroundColor:"#f4f6f8", color:"#000" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" },
  heading: { fontSize:"32px", fontWeight:"bold", color:"#111827" },
  logoutBtn: { padding:"10px 20px", backgroundColor:"#dc2626", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"bold" },
  subHeading: { marginBottom:"15px", color:"#111827" },
  grid: { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"20px", marginBottom:"20px" },
  card: { backgroundColor:"#fff", padding:"20px", borderRadius:"12px", boxShadow:"0 4px 10px rgba(0,0,0,0.1)" },
  cardTitle: { color:"#6b7280", marginBottom:"10px" },
  cardValue: { fontSize:"28px", fontWeight:"bold", color:"#111827" },
  progressContainer: { backgroundColor:"#fff", padding:"20px", borderRadius:"12px", marginBottom:"20px", boxShadow:"0 4px 10px rgba(0,0,0,0.1)" },
  progressHeader: { display:"flex", justifyContent:"space-between", marginBottom:"10px", fontWeight:"bold", color:"#111827" },
  progressBar: { width:"100%", height:"14px", backgroundColor:"#e5e7eb", borderRadius:"999px", overflow:"hidden" },
  progressFill: { height:"100%", backgroundColor:"#16a34a", transition:"width 0.3s ease" },
  listBox: { backgroundColor:"#fff", padding:"20px", borderRadius:"12px", boxShadow:"0 4px 10px rgba(0,0,0,0.1)" },
  inputContainer: { display:"flex", gap:"10px", marginBottom:"20px" },
  input: { flex:1, padding:"10px", borderRadius:"8px", border:"1px solid #d1d5db", fontSize:"16px" },
  addButton: { backgroundColor:"#2563eb", color:"#fff", border:"none", padding:"10px 16px", borderRadius:"8px", cursor:"pointer", fontWeight:"bold" },
  list: { listStyle:"none", padding:0, margin:0 },
  taskRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #e5e7eb" },
  listItem: { fontSize:"18px" },
  buttonGroup: { display:"flex", gap:"8px" },
  completeButton: { backgroundColor:"#16a34a", color:"#fff", border:"none", padding:"8px 12px", borderRadius:"6px", cursor:"pointer" },
  deleteButton: { backgroundColor:"#dc2626", color:"#fff", border:"none", padding:"8px 12px", borderRadius:"6px", cursor:"pointer" },
};