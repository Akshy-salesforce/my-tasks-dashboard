 "use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#000" },
  box: { background:"#111", padding:"2rem", borderRadius:"10px", width:"300px", color:"#fff" },
  input: { width:"100%", padding:"10px", margin:"10px 0", borderRadius:"5px", border:"1px solid #444", background:"#222", color:"#fff" },
  button: { width:"100%", padding:"10px", background:"#fff", color:"#000", border:"none", borderRadius:"5px", cursor:"pointer" },
  error: { color:"red", fontSize:"14px" }
};