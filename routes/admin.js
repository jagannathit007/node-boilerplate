var express = require('express');
var router = express.Router();

const constants = require('./../config/constants');
const { authenticateAdminToken } = require('./../middlewares/authenticator');
const uploader = require('./../middlewares/fileUploader');

//CONTROLLERS
let authCtrl = require("./../controllers/admin/authentication");
let subscriptionsMasterCtrl = require("./../controllers/admin/subscriptions_master");
let topicsMasterCtrl = require("./../controllers/admin/topics_master");

//AUTHENTICATION MODULE
router.post("/loginAdmin", authCtrl.loginAdmin);
router.post("/updateProfile", authenticateAdminToken, authCtrl.updateProfile);
router.post("/changePassword", authenticateAdminToken, authCtrl.changePassword);

//ADMIN MODULE
router.post("/saveAdmin", authCtrl.registerAdmin);
router.post("/getAdmins", authenticateAdminToken, authCtrl.getAdmins);
router.post("/deleteAdmin", authenticateAdminToken, authCtrl.deleteAdmins);

//SUBSCRIPTION MODULE
router.post("/saveSubscription", authenticateAdminToken, subscriptionsMasterCtrl.saveSubscription);
router.post("/getSubscriptionList", authenticateAdminToken, subscriptionsMasterCtrl.getSubscriptionList);
router.post("/deleteSubscription", authenticateAdminToken, subscriptionsMasterCtrl.deleteSubscription);

//TOPIC MODULE
router.post("/saveTopic", authenticateAdminToken, uploader(constants.UPLOADS.TOPICS).single('image'), topicsMasterCtrl.saveTopic);
router.post("/getTopics", authenticateAdminToken,  topicsMasterCtrl.getTopicList);
router.post("/deleteTopic", authenticateAdminToken, topicsMasterCtrl.deleteTopic);

module.exports = router;
