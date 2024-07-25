const multer = require("multer");
const path = require("path");

const uploader = (pathName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), pathName));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        crypto.randomUUID() +
        Math.round(Math.random() * 1e9 * 987);
      const fileExtension = path.extname(file.originalname);
      const fileFullName = `${uniqueSuffix}${fileExtension}`;
      cb(null, fileFullName);
    },
  });
  return multer({ storage });
};

module.exports = { uploader };
