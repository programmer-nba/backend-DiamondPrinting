const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
  }
});

// Create Multer instance with storage configuration
const upload = multer({ storage: storage });

module.exports = upload