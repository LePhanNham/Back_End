// photoRoutes.js
const express = require("express");
const router = express.Router();
const PhotoController = require("../controller/PhotoController");
const authenticateToken = require("../middleware/authenticateToken");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/photosOfUser/:id", PhotoController.getPhotosOfUser);
router.post(
  "/uploadPhoto",
  authenticateToken,
  upload.single("photo"),
  PhotoController.uploadPhoto,
);
router.post(
  "/:photoId/comments",
  authenticateToken,
  PhotoController.addCommentToPhoto,
);

module.exports = router;
