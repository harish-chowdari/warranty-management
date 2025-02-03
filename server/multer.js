const multer = require("multer");
const path = require("path");
const fs = require("fs");

//multer Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, require("path").resolve(__dirname, "..") + "/server/upload");
    },
    filename: function (req, file, cb) {
        if (file.fieldname === "image") {
            cb(null, Date.now() + "-" + file.fieldname + ".png");
        }
    },
});

const upload = multer({ storage: storage });

//middleware for product images uploading to multer
const bookUpload = upload.fields([{ name: "image", maxCount: 1 }]);

module.exports = {
    bookUpload,
};
