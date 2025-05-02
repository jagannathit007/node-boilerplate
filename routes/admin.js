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

// localhost:3100/admin/saveSubscription
router.post("/registerAdmin", subscriptionsMasterCtrl.saveSubscription);

// localhost:3100/admin/getSubscriptionList
router.post("/registerAdmin", subscriptionsMasterCtrl.getSubscriptionList);

// localhost:3100/admin/deleteSubscription
router.post("/registerAdmin", subscriptionsMasterCtrl.deleteSubscription);

// localhost:3100/admin/saveTopic
router.post("/registerAdmin", topicsMasterCtrl.saveTopic);

// localhost:3100/admin/getTopicList
router.post("/registerAdmin", topicsMasterCtrl.getTopicList);

// localhost:3100/admin/deleteTopic
router.post("/registerAdmin", topicsMasterCtrl.deleteTopic);

module.exports = router;
