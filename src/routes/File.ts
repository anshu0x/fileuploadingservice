import express from "express";
import upload from "../lib/multer";
import FileController from "../controller/FileController";
import { DELETE_SINGLE_FILE, GET_SINGLE_FILE } from "../validation/FileRouter";
import apicache from 'apicache'
let cache = apicache.middleware

const FileRouter = express.Router();

FileRouter.post("/upload", upload.single("file"), FileController.UPLOAD_FILE);

FileRouter.get("/getfile/:id",cache('15 minutes'),GET_SINGLE_FILE, FileController.GET_SINGLE_FILE);

FileRouter.delete("/deleteAll", FileController.DELETE_ALL_FILES);

FileRouter.delete("/delete/:id", DELETE_SINGLE_FILE, FileController.DELETE_SINGLE_FILES);

FileRouter.get("/read_dir_all_files", FileController.READ_DIR_ALL_FILES);

export default FileRouter