const express = require("express");
const router = express.Router();
const constants = require("./../config/constants");

//Middlewares
const { authenticateMobileToken } = require("./../middlewares/authenticator");
const fileUploader = require("./../middlewares/fileUploader");

//Controllers
let authCtrl = require("./../controllers/mobile/authentication");

// localhost:3100/mobile/signIn
router.post("/signIn", authCtrl.signIn);

// localhost:3100/mobile/signUp
router.post("/signUp", authCtrl.signUp);

// localhost:3100/mobile/userById
router.post("/userById", authenticateMobileToken, authCtrl.getUserById);

// localhost:3100/mobile/userById
router.post(
  "/updateProfileImage",
  authenticateMobileToken,
  fileUploader(constants.UPLOADS.PROFILES).single("file"),
  authCtrl.updateProfileImage
);

module.exports = router;
