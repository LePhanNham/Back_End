// PhotoController.js
const Photo = require("../db/photoModel");

// Get photos of a user by ID with comments
const getPhotosOfUser = async (req, res) => {
  try {
    const photos = await Photo.find({ user_id: req.params.id });

    if (!photos || photos.length === 0) {
      return res.status(404).json({ msg: "No photos found for this user" });
    }

    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Add a new comment to a photo
const addCommentToPhoto = async (req, res) => {
  try {
    const { comment } = req.body;
    const user_id = req.user_id;
    const user_name = req.user_name;
    const photoId = req.params.photoId;
    // console.log(user_id);
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    const newComment = {
      comment,
      user_id,
      user_name,
      date_time: new Date(),
    };

    photo.comments.push(newComment);

    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Upload a new photo
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const newPhoto = new Photo({
      user_id: req.user_id,
      file_name: req.file.filename,
    });

    await newPhoto.save();
    res.json({
      // deo hieu
      ...newPhoto._doc,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getPhotosOfUser,
  uploadPhoto,
  addCommentToPhoto,
};
