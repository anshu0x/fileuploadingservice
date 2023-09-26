import multer from "multer";
import { file_upload_location } from "../constants/path";

const storage = multer.memoryStorage()

const upload = multer({ storage });

export default upload;
