import type {
    MergeJob as SharedMergeJob,
    MergeJobStatus,
    ServerClipMeta,
    OutputFormat
  } from "@chaos-merge/shared-types";
  
  /**
   * Internal job shape stored in memory by the backend.
   * Extends the shared type but adds backend-only metadata.
   */
  export interface MergeJobInternal extends SharedMergeJob {
    /** Timestamp (ms) when job was created */
    createdAt: number;
  
    /** Timestamp (ms) when job last updated */
    updatedAt: number;
  
    /** Internal path to the final output file */
    outputAbsPath?: string;
  
    /** Internal path list of input files */
    clipAbsPaths?: string[];
  }
  
  /**
   * Payload accepted when creating a new merge job.
   */
  export interface CreateMergeJobPayload {
    clips: ServerClipMeta[];
    format: OutputFormat;
  }
  
  /**
   * Shape returned by the mergeRoutes POST /merge endpoint.
   */
  export interface CreateMergeJobResponse {
    jobId: string;
  }
  
  /**
   * Shape returned when polling a job from GET /merge/:id
   */
  export type MergeJobPollResponse = SharedMergeJob;
  
  /**
   * Internal patch update type for JobStore.update()
   */
  export type MergeJobPatch = Partial<MergeJobInternal>;
  