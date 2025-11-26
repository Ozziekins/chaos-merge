import { useState } from "react";
import type {
  LocalClip,
  OutputFormat,
  MergeJob,
  MergeStatus
} from "../shared/types";
import { uploadFiles, createMergeJob, getMergeJob } from "../api/mergeApi";

export function useMergeStudioState() {
  const [clips, setClips] = useState<LocalClip[]>([]);
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [job, setJob] = useState<MergeJob | null>(null);
  const [status, setStatus] = useState<MergeStatus>("idle");

  const totalSizeMb =
    clips.reduce((sum, c) => sum + c.sizeBytes, 0) / (1024 * 1024);

  function addClips(files: File[]) {
    const mapped: LocalClip[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      sizeBytes: file.size,
      thumbnailUrl: URL.createObjectURL(file)
    }));
    setClips((prev) => [...prev, ...mapped]);
  }

  function removeClip(id: string) {
    setClips((prev) => prev.filter((c) => c.id !== id));
  }

  function reorderClips(fromIndex: number, toIndex: number) {
    setClips((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }

  async function startMerge() {
    if (!clips.length || status === "uploading" || status === "rendering") {
      return;
    }

    try {
      setStatus("uploading");

      const serverClips = await uploadFiles(clips.map((c) => c.file));

      const { jobId } = await createMergeJob(serverClips, format);

      setStatus("rendering");
      setJob({
        id: jobId,
        progress: 0,
        status: "processing",
        clips: serverClips,
        format
      });

      const poll = async () => {
        const fullJob = await getMergeJob(jobId);
        setJob(fullJob);

        if (fullJob.status === "finished") {
          setStatus("finished");
          return;
        }
        if (fullJob.status === "error") {
          setStatus("error");
          return;
        }
        setTimeout(poll, 1000);
      };

      poll();
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  function reset() {
    setClips([]);
    setJob(null);
    setStatus("idle");
  }

  return {
    clips,
    format,
    job,
    status,
    totalSizeMb,
    addClips,
    removeClip,
    reorderClips,
    setFormat,
    startMerge,
    reset
  };
}
