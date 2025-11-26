import type { MergeJobInternal, MergeJobPatch } from "./jobTypes";
import type { MergeJob } from "@chaos-merge/shared-types";

const jobs = new Map<string, MergeJobInternal>();

export const JobStore = {
  create(job: MergeJob) {
    const now = Date.now();
    const internal: MergeJobInternal = {
      ...job,
      createdAt: now,
      updatedAt: now
    };
    jobs.set(job.id, internal);
  },
  update(id: string, patch: MergeJobPatch) {
    const current = jobs.get(id);
    if (!current) return;
    jobs.set(id, { ...current, ...patch, updatedAt: Date.now() });
  },
  get(id: string): MergeJob | undefined {
    const internal = jobs.get(id);
    if (!internal) return undefined;
    // Return only the shared MergeJob fields
    const { createdAt, updatedAt, outputAbsPath, clipAbsPaths, ...shared } = internal;
    return shared;
  }
};
