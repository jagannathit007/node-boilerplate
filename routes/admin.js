var express = require('express');
var router = express.Router();

//Controllers
let authCtrl = require("./../controllers/admin/authentication");
let subscriptionsMasterCtrl = require("./../controllers/admin/subscriptions_master");
let topicsMasterCtrl = require("./../controllers/admin/topics_master");

// localhost:3100/admin/loginAdmin
router.post("/loginAdmin", authCtrl.loginAdmin);

// localhost:3100/admin/registerAdmin
router.post("/registerAdmin", authCtrl.registerAdmin);

router.post("/getAdmins", authCtrl.getAdmins);

// localhost:3100/admin/saveSubscription
router.post("/saveSubscription", subscriptionsMasterCtrl.saveSubscription);

// localhost:3100/admin/getSubscriptionList
router.post("/getSubscriptionList", subscriptionsMasterCtrl.getSubscriptionList);

// localhost:3100/admin/deleteSubscription
router.post("/deleteSubscription", subscriptionsMasterCtrl.deleteSubscription);

// localhost:3100/admin/saveTopic
router.post("/saveTopic", topicsMasterCtrl.saveTopic);

// localhost:3100/admin/getTopicList
router.post("/getTopicList", topicsMasterCtrl.getTopicList);

// localhost:3100/admin/deleteTopic
router.post("/deleteTopic", topicsMasterCtrl.deleteTopic);

module.exports = router;
