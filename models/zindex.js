//Maintain this json, for easy access to models anywhere in the app.
module.exports = {
    users: require('./users'),
    affirmations: require('./affirmations'),
    bug_reports: require('./bug_reports'),
    journals: require('./journals'),
    settings: require('./settings'),
    subscriptions_master: require('./subscriptions_master'),
    topics_master: require('./topics_master'),
    user_subscriptions: require('./user_subscriptions'),
    admin: require('./admin'),
}