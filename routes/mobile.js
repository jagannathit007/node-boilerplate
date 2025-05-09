const express = require("express");
const router = express.Router();
const constants = require("./../config/constants");

//MIDDLEWARE
const { authenticateMobileToken } = require("./../middlewares/authenticator");
const fileUploader = require("./../middlewares/fileUploader");

//CONTROLLERS
const authCtrl = require("./../controllers/mobile/authentication");
const topicCtrl = require("./../controllers/mobile/topics");
const affirmationCtrl = require('./../controllers/mobile/affirmations');

//AUTHENTICATION AND PROFILE MODULE
router.post("/signIn", authCtrl.signIn);
router.post("/signUp", authCtrl.signUp);
router.post("/userById", authenticateMobileToken, authCtrl.getUserById);
router.post("/updateUser", authenticateMobileToken, authCtrl.updateUser);
let profileUpload = fileUploader(constants.UPLOADS.PROFILES).single("file");
router.post("/updateProfileImage", authenticateMobileToken, profileUpload, authCtrl.updateProfileImage);

//TOPICS MODULE
router.post("/getTopics", authenticateMobileToken, topicCtrl.getTopics);

//AFFIRMATION MODULE
router.post("/getAffirmations", authenticateMobileToken, affirmationCtrl.getAffirmations);
router.post("/saveAffirmation", authenticateMobileToken, affirmationCtrl.saveAffirmation);
router.post("/deleteAffirmation", authenticateMobileToken, affirmationCtrl.deleteAffirmation);

module.exports = router;
