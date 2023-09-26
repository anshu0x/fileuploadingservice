import express from "express";
import upload from "../lib/multer";
import FileController from "../controller/FileController";
import { GET_FILE_VALIDATION } from "../validation/FileRouter";

const FileRouter = express.Router();

FileRouter.post("/upload", upload.single("file"), FileController.UPLOAD_FILE);

FileRouter.get("/getfile/:id",GET_FILE_VALIDATION, FileController.GET_SINGLE_FILE);


FileRouter.delete("/deleteAll", FileController.DELETE_ALL_FILES);

FileRouter.delete("/delete/:id", FileController.DELETE_SINGLE_FILES);

FileRouter.get("/read_dir_all_files", FileController.READ_DIR_ALL_FILES);

export default FileRouter