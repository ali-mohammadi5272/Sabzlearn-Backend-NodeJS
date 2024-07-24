const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "./public/courses/covers"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomUUID() + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileFullName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileFullName);
  },
});

const uploader = multer({ storage: storage });

module.exports = { uploader };
