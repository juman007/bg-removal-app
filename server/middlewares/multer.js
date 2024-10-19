import multer from "multer";

// creating multer middleware from passing from data

const storage = multer.diskStorage({
   filename: (req, file, callback) => {
      callback(null, `${Date.now()}_${file.originalname}`);
   },
});

const upload = multer({ storage });

export default upload;
