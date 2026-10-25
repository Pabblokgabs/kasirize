// lib/api/index.ts
// Pure API fetch functions — no React, no state

export async function fetchLiveUserData(email: string) {
  const res = await fetch(`/api/user/live-data?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

export async function fetchTasks(params?: { status?: string }) {
  const url = params?.status ? `/api/tasks?status=${params.status}` : "/api/tasks";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function fetchOpportunities() {
  const res = await fetch("/api/opportunities");
  if (!res.ok) throw new Error("Failed to fetch opportunities");
  return res.json();
}

export async function fetchApplications() {
  const res = await fetch("/api/applications");
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function fetchYouth() {
  const res = await fetch("/api/youth");
  if (!res.ok) throw new Error("Failed to fetch youth");
  return res.json();
}

export async function applyToTask(
  taskId: string,
  payload: { action: string; youthId: string; youthName: string },
) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to apply to task");
  return res.json();
}

export async function verifyTask(
  taskId: string,
  payload: {
    action: string;
    rating: number;
    feedback: string;
    skillsDemonstrated: string[];
    reviewerId: string;
    reviewerName: string;
  },
) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to verify task");
  return res.json();
}

export async function postTask(payload: Record<string, unknown>) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to post task");
  return res.json();
}

export async function postOpportunity(payload: Record<string, unknown>) {
  const res = await fetch("/api/opportunities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to post opportunity");
  return res.json();
}

export async function postApplication(payload: Record<string, unknown>) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit application");
  return res.json();
}

export async function patchApplication(
  applicationId: string,
  payload: Record<string, unknown>,
) {
  const res = await fetch(`/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}
