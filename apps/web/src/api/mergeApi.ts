import { apiFetch, API_BASE } from "./client";
import type { ServerClipMeta, MergeJob, OutputFormat } from "../shared/types";

export async function uploadFiles(files: File[]): Promise<ServerClipMeta[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.clips as ServerClipMeta[];
}

export async function createMergeJob(
  clips: ServerClipMeta[],
  format: OutputFormat
): Promise<{ jobId: string }> {
  return apiFetch<{ jobId: string }>("/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clips, format })
  });
}

export async function getMergeJob(jobId: string): Promise<MergeJob> {
  return apiFetch<MergeJob>(`/merge/${jobId}`);
}
