// hooks/queries/index.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyToTask,
  fetchApplications,
  fetchLiveUserData,
  fetchOpportunities,
  fetchTasks,
  fetchYouth,
  patchApplication,
  postApplication,
  postOpportunity,
  postTask,
  verifyTask,
} from "@/lib/api";

// ── Query Keys (typed constants for cache consistency) ──────────────────────
export const QueryKeys = {
  liveUserData: (email: string) => ["user", "live-data", email] as const,
  tasks: (status?: string) => ["tasks", status ?? "all"] as const,
  opportunities: () => ["opportunities"] as const,
  applications: () => ["applications"] as const,
  youth: () => ["youth"] as const,
} as const;

// ── Queries ──────────────────────────────────────────────────────────────────

export function useLiveUserData(email: string | undefined) {
  return useQuery({
    queryKey: QueryKeys.liveUserData(email ?? ""),
    queryFn: () => fetchLiveUserData(email!),
    enabled: Boolean(email),
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 1,
  });
}

export function useTasks(status?: string) {
  return useQuery({
    queryKey: QueryKeys.tasks(status),
    queryFn: () => fetchTasks(status ? { status } : undefined),
    staleTime: 1000 * 60, // 1 min
    retry: 1,
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: QueryKeys.opportunities(),
    queryFn: fetchOpportunities,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useApplications() {
  return useQuery({
    queryKey: QueryKeys.applications(),
    queryFn: fetchApplications,
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function useYouth() {
  return useQuery({
    queryKey: QueryKeys.youth(),
    queryFn: fetchYouth,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useApplyToTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: Parameters<typeof applyToTask>[1];
    }) => applyToTask(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useVerifyTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: Parameters<typeof verifyTask>[1];
    }) => verifyTask(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function usePostTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function usePostOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postOpportunity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}

export function usePostApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postApplication,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function usePatchApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => patchApplication(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
