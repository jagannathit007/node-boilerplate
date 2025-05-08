var express = require('express');
var router = express.Router();

const { authenticateAdminToken } = require('./../middlewares/authenticator');

//Controllers
let authCtrl = require("./../controllers/admin/authentication");
let subscriptionsMasterCtrl = require("./../controllers/admin/subscriptions_master");
let topicsMasterCtrl = require("./../controllers/admin/topics_master");

// localhost:3100/admin/loginAdmin
router.post("/loginAdmin", authCtrl.loginAdmin);

// localhost:3100/admin/registerAdmin
router.post("/saveAdmin", authCtrl.registerAdmin);

router.post("/getAdmins", authenticateAdminToken, authCtrl.getAdmins);
router.post("/deleteAdmin", authenticateAdminToken, authCtrl.deleteAdmins);

// localhost:3100/admin/saveSubscription
router.post("/saveSubscription", authenticateAdminToken, subscriptionsMasterCtrl.saveSubscription);

// localhost:3100/admin/getSubscriptionList
router.post("/getSubscriptionList", authenticateAdminToken, subscriptionsMasterCtrl.getSubscriptionList);

// localhost:3100/admin/deleteSubscription
router.post("/deleteSubscription", authenticateAdminToken, subscriptionsMasterCtrl.deleteSubscription);

// localhost:3100/admin/saveTopic
router.post("/saveTopic", authenticateAdminToken, topicsMasterCtrl.saveTopic);

// localhost:3100/admin/getTopicList
router.post("/getTopicList", authenticateAdminToken, topicsMasterCtrl.getTopicList);

// localhost:3100/admin/deleteTopic
router.post("/deleteTopic", authenticateAdminToken, topicsMasterCtrl.deleteTopic);

module.exports = router;
