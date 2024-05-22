// userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/register", UserController.registerUser);
router.get("/list", UserController.getUsersList);
router.get("/:id", UserController.getUserById);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);

module.exports = router;
