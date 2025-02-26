// warrantyUpload.js
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..") + "/server/upload");
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "purchaseProof") {
      cb(null, Date.now() + "-" + file.fieldname + ".png");
    }
  }
});
const upload = multer({ storage });
const warrantyUpload = upload.single("purchaseProof");
module.exports = { warrantyUpload };
