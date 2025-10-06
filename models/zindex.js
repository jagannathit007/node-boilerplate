//Maintain this json, for easy access to models anywhere in the app.
module.exports = {
    admin: require('./admin.model'),
    banner: require('./banner.model'),
    doctor: require('./doctor.model'),
    equipment: require('./equipment.model'),
    patient: require('./patient.model'),
    request: require('./request.model'),
    service: require('./service.model'),
    ratingFeedback: require('./rating-feedback.model'),
}