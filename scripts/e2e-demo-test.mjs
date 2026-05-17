/**
 * End-to-end demo flow against local API (matches seed-demo.ts).
 * Run: node scripts/e2e-demo-test.mjs
 * Optional: API_BASE=http://localhost:5000/api/v1 node scripts/e2e-demo-test.mjs
 */
import axios from "axios";

const API_BASE =
  process.env.API_BASE || "http://localhost:5000/api/v1";

const API = axios.create({ baseURL: API_BASE });

const PASSWORD = "Demo1234!";
const USERS = {
  admin: "admin@demo.taskflow.com",
  manager: "manager@demo.taskflow.com",
  member: "member@demo.taskflow.com",
};

let passed = 0;
let failed = 0;

function ok(label) {
  passed += 1;
  console.log(`✓ ${label}`);
}

function fail(label, error) {
  failed += 1;
  console.error(`✗ ${label}:`, error?.response?.data?.message ?? error?.message ?? error);
}

async function login(email) {
  const { data } = await API.post("/auth/login", {
    email,
    password: PASSWORD,
  });
  if (!data?.token || !data?.user) {
    throw new Error(`Invalid login response for ${email}`);
  }
  return data;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function run() {
  console.log(`\nE2E demo test → ${API_BASE}\n`);

  try {
    const admin = await login(USERS.admin);
    ok("Admin login");

    const manager = await login(USERS.manager);
    ok("Manager login");

    const member = await login(USERS.member);
    ok("Member login");

    const adminTasks = await API.get("/tasks", {
      headers: authHeaders(admin.token),
    });
    const managerTasks = await API.get("/tasks", {
      headers: authHeaders(manager.token),
    });
    const memberTasks = await API.get("/tasks", {
      headers: authHeaders(member.token),
    });

    const count = (res) =>
      res.data?.results ?? res.data?.data?.length ?? 0;

    if (count(adminTasks) >= 3) ok(`Admin sees ${count(adminTasks)} tasks`);
    else fail("Admin task count", `expected >=3, got ${count(adminTasks)}`);

    if (count(managerTasks) >= 2)
      ok(`Manager sees ${count(managerTasks)} tasks`);
    else fail("Manager task count", `expected >=2, got ${count(managerTasks)}`);

    if (count(memberTasks) === 1)
      ok(`Member sees ${count(memberTasks)} task (manager-created only)`);
    else fail("Member task count", `expected 1, got ${count(memberTasks)}`);

    const projects = await API.get("/projects", {
      headers: authHeaders(admin.token),
    });
    if ((projects.data?.results ?? 0) >= 1)
      ok("Admin sees demo project");
    else fail("Projects", "no projects for admin");

    const assignable = await API.get("/users/assignable", {
      headers: authHeaders(manager.token),
    });
    if ((assignable.data?.results ?? assignable.data?.data?.length ?? 0) >= 1)
      ok("Manager can load assignable users");
    else fail("Assignable users", "empty list for manager");

    const memberTaskId =
      memberTasks.data?.data?.[0]?._id ?? memberTasks.data?.data?.[0]?.id;
    if (memberTaskId) {
      await API.patch(
        `/tasks/${memberTaskId}`,
        { status: "completed" },
        { headers: authHeaders(member.token) }
      );
      ok("Member can mark task completed");
    } else {
      fail("Member status update", "no task id");
    }

    await API.post(
      "/tasks",
      {
        title: "E2E UI test task",
        description: "Created by automated test",
        priority: "medium",
        assignedTo: USERS.member,
      },
      { headers: authHeaders(manager.token) }
    );
    ok("Manager can create task");

    try {
      await API.post(
        "/tasks",
        {
          title: "Should fail",
          assignedTo: USERS.admin,
        },
        { headers: authHeaders(manager.token) }
      );
      fail("Manager assign to admin", "should have been rejected");
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403)
        ok("Manager blocked from assigning to admin");
      else fail("Manager assign to admin", err);
    }
  } catch (error) {
    fail("Unexpected error", error);
  }

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
