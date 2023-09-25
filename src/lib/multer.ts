import multer from "multer";
import { file_upload_location } from "../constants/path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, file_upload_location);
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
