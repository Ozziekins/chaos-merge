import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import type { ServerClipMeta } from "@chaos-merge/shared-types";
import { uploadsPath } from "../services/pathService";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      const dest = uploadsPath();
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    } catch (error: any) {
      cb(error, "");
    }
  },
  filename: (_req, file, cb) => {
    const id = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  }
});

const upload = multer({ storage });

export const uploadRouter = Router();

uploadRouter.post("/", upload.array("files"), (req, res) => {
  try {
  const files = (req.files as Express.Multer.File[]) ?? [];

    if (files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

  const clips: ServerClipMeta[] = files.map((f) => ({
    id: path.parse(f.filename).name,
    originalName: f.originalname,
    sizeBytes: f.size
  }));

  res.json({ clips });
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Upload failed" });
  }
});
