const multer = require("multer");
const path = require("path");

// Set storage engine (where the file will be stored and what the file name will be)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder
  },
  filename: (req, file, cb) => {
    // Ensure file name is unique by appending a timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Adds the original file extension
  }
});

// Filter to only accept image files
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer with the storage and filter settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Max file size (5MB)
}).single("photo"); // "photo" is the field name in the form or request

module.exports = upload;
