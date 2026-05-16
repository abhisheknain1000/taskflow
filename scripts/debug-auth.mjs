/**
 * Run: node scripts/debug-auth.mjs
 * Verifies signup + login against the backend with demo credentials.
 */
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

const DEMO_MEMBER = {
  name: "Demo Member",
  email: "demo.member@taskflow.com",
  password: "DemoPass1!",
  role: "member",
};

const DEMO_ADMIN = {
  email: "admin@admin.com",
  password: "DemoPass1!",
};

async function run() {
  console.log("--- Login (member) ---");
  const login = await API.post("/auth/login", {
    email: DEMO_MEMBER.email,
    password: DEMO_MEMBER.password,
  });
  console.log("OK:", login.data.user.email, "role:", login.data.user.role);

  console.log("\n--- Login (admin) ---");
  const adminLogin = await API.post("/auth/login", DEMO_ADMIN);
  console.log("OK:", adminLogin.data.user.email, "role:", adminLogin.data.user.role);

  console.log("\n--- Signup duplicate (expect friendly error) ---");
  try {
    await API.post("/auth/signup", DEMO_MEMBER);
  } catch (err) {
    console.log("Expected:", err.response?.data?.message);
  }

  console.log("\nAll auth checks passed.");
}

run().catch((err) => {
  console.error("FAILED:", err.response?.data ?? err.message);
  process.exit(1);
});
