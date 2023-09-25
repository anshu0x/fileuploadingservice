import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { file_upload_location } from "../constants/path";
import { createReadStream } from "node:fs";
import { lookup } from "mrmime";

export default class FileController {
  static UPLOAD_FILE = (req: Request, res: Response) => {
    try {
      res.status(201).json({
        message: "File Uploaded successfully !",
        file: req?.file,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  static GET_SINGLE_FILE = async (req: Request, res: Response) => {
    const fileId = req.params.id;
    try {
      const files = await fs.readdir(file_upload_location);
      const fileExists = files.find((file) => file.startsWith(fileId));
      if (fileExists) {
        const filePath = path.join(file_upload_location, fileExists);
        const fileStream = createReadStream(filePath);
        let ContentType = lookup(fileExists) as string;
        res.writeHead(200, {
          "Content-Type": ContentType,
          "Cache-Control": "public, max-age=3600",
        });
        fileStream.pipe(res);
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error) {
      console.error("Error reading directory:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  static DELETE_ALL_FILES = async (req: Request, res: Response) => {
    // Make the route handler async
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
      console.error("Error reading directory:", error);
      throw error;
    }
  };
}
