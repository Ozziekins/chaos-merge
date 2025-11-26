import type { LocalClip, MergeJob, OutputFormat, MergeStatus } from "../shared/types";

export interface MergeStudioState {
  clips: LocalClip[];
  format: OutputFormat;
  job: MergeJob | null;
  status: MergeStatus;
  totalSizeMb: number;

  addClips(files: File[]): void;
  removeClip(id: string): void;
  reorderClips(fromIndex: number, toIndex: number): void;
  setFormat(format: OutputFormat): void;
  startMerge(): Promise<void>;
  reset(): void;
}
