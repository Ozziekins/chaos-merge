import { Router } from "express";
import path from "path";
import crypto from "crypto";
import type { ServerClipMeta, MergeJob } from "@chaos-merge/shared-types";
import { JobStore } from "../jobs/inMemoryJobStore";
import { uploadsPath, publicPath } from "../services/pathService";
import { mergeVideos } from "../services/ffmpegService";

export const mergeRouter = Router();

mergeRouter.post("/", (req, res) => {
  try {
  const { clips, format } = req.body as {
    clips: ServerClipMeta[];
    format: "mp4" | "webm";
  };

    if (!clips || !Array.isArray(clips) || clips.length === 0) {
      return res.status(400).json({ error: "No clips provided" });
    }

    if (!format || (format !== "mp4" && format !== "webm")) {
      return res.status(400).json({ error: "Invalid format" });
    }

  const id = crypto.randomUUID();

  const job: MergeJob = {
    id,
    clips,
    format,
    progress: 0,
    status: "queued"
  };

  JobStore.create(job);

  const clipPaths = clips.map((c) =>
    uploadsPath(`${c.id}${path.extname(c.originalName)}`)
  );

  (async () => {
    try {
      JobStore.update(id, { status: "processing" });

      const outPath = await mergeVideos({
        clipPaths,
        outputFormat: format,
        onProgress: (percent) =>
          JobStore.update(id, { progress: percent, status: "processing" })
      });

      const rel = outPath.replace(publicPath(), "");
      JobStore.update(id, {
        status: "finished",
        progress: 100,
        outputUrl: `/public${rel}`
      });
    } catch (e: any) {
      JobStore.update(id, {
        status: "error",
        errorMessage: e?.message ?? "Unknown error"
      });
    }
  })();

  res.json({ jobId: id });
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Failed to create merge job" });
  }
});

mergeRouter.get("/:id", (req, res) => {
  const job = JobStore.get(req.params.id);
  if (!job) return res.status(404).json({ message: "Not found" });
  res.json(job);
});
