// Re-export shared monorepo types
export * from "@chaos-merge/shared-types";

export interface LocalClip {
  id: string;             // client-side temp id
  file: File;
  sizeBytes: number;
  thumbnailUrl?: string;
}

export type MergeStatus =
  | "idle"
  | "uploading"
  | "rendering"
  | "finished"
  | "error";
