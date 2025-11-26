export type OutputFormat = "mp4" | "webm";

export interface ServerClipMeta {
  id: string;             // id used in filenames
  originalName: string;
  sizeBytes: number;
  durationSeconds?: number;
}

export type MergeJobStatus = "queued" | "processing" | "finished" | "error";

export interface MergeJob {
  id: string;
  clips: ServerClipMeta[];
  format: OutputFormat;
  progress: number;       // 0..100
  status: MergeJobStatus;
  outputUrl?: string;
  errorMessage?: string;
}
