import multer from "multer";
const storage = multer.diskStorage({}); // store in tmp dir
export const upload = multer({ storage });
