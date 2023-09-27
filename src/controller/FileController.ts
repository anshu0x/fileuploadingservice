import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { file_upload_location } from "../constants/path";
import { createWriteStream } from "node:fs";
import { lookup } from "mrmime";
import sharp from "sharp";
import { validationResult } from "express-validator";
import { Readable } from "stream";
import { createReadStream } from "fs";
export default class FileController {
  static UPLOAD_FILE = async (req: Request, res: Response) => {
    try {
      const { buffer } = req.file as any;
      const fileName = `${Number(
        Math.floor(Date.now() * 1e4 * Math.random())
      )}.webp`;

      const writableStream = createWriteStream(
        path.join(file_upload_location, fileName)
      );

      const transformer = sharp().webp({ quality: 100 });

      // Create a Readable stream from the buffer and pipe it through Sharp
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null); // End the stream

      readableStream.pipe(transformer).pipe(writableStream);

      writableStream.on("finish", () => {
        res.status(201).json({
          message: "File Uploaded successfully !",
          id: fileName,
        });
      });

      writableStream.on("error", (error) => {
        throw new Error("Failed to upload file");
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  static GET_SINGLE_FILE = async (
    req: Request<{ id: string }, {}, {}, { quality: number }>,
    res: Response
  ) => {
    const fileId = req.params.id;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const files = await fs.readdir(file_upload_location);
      const fileExists = files.find((file) => file.startsWith(fileId));
      if (fileExists) {
        const filePath = path.join(file_upload_location, fileExists);
        const quality = Number(req.query.quality) || 100;

        res.setHeader('Content-Type', lookup(fileExists) || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('X-Image-Quality', String(quality));

        const readStream = createReadStream(filePath);
        const transformStream = sharp().webp({ quality });

        readStream.pipe(transformStream).pipe(res);
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error reading directory:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  static DELETE_ALL_FILES = async (req: Request, res: Response) => {
    try {
      const files = await fs.readdir(file_upload_location);
      if (files.length > 0) {
        await Promise.all(
          files.map(async (item) => {
            // Use Promise.all to await all unlink operations
            await fs.unlink(path.join(file_upload_location, item)); // Use file_upload_location instead of __dirname
          })
        );
        return res.json({ message: "Deleted Successfully!" });
      }
      return res.json({ message: "No files found !" });
    } catch (error) {
      console.error("Error deleting files:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  static DELETE_SINGLE_FILES = async (req: Request, res: Response) => {
    const fileId = req.params.id;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      fs.readdir(file_upload_location).then((files) => {
        const fileExists = files.find((file) => file.startsWith(fileId));
        if (fileExists) {
          fs.unlink(path.join(file_upload_location, fileExists));
          return res.json({ message: "Deleted Successfully !" });
        }
        res.json({ message: "file not found !" });
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  static READ_DIR_ALL_FILES = async (req: Request, res: Response) => {
    try {
      const files = await fs.readdir(file_upload_location);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
}
