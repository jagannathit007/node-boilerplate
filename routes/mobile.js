const { Router } = require("express");
const { mobileAuthMiddleware } = require("../middlewares/mobile-auth.js");
const  mobileAuthController  = require("../controllers/mobile/patient/auth.controller.js");
const  mobileAuthController  = require("../controllers/mobile/doctor/auth.controller.js");
const  patientRequestsController  = require("../controllers/mobile/patient/requests.controller.js");
const { patientFeedbackController } = require("../controllers/mobile/patient/feedback.js");
const { doctorProfileController } = require("../controllers/mobile/doctor/profile.js");
const { doctorAppointmentsController } = require("../controllers/mobile/doctor/appointments.js");

const router = Router();

// Patient Authentication
router.post('/patient/register', mobileAuthController.register);
router.post('/patient/login', mobileAuthController.login);
router.post('/patient/update-profile', mobileAuthMiddleware, mobileAuthController.updateProfile);
router.post('/patient/change-password', mobileAuthMiddleware, mobileAuthController.changePassword); 

router.post('/patient/requests/create', mobileAuthMiddleware, patientRequestsController.createRequest);
router.post('/patient/requests/get', mobileAuthMiddleware, patientRequestsController.getPatientRequests);
router.post('/patient/requests/cancel/:requestId', mobileAuthMiddleware, patientRequestsController.cancelRequest);
router.post('/patient/feedback/submit', mobileAuthMiddleware, patientFeedbackController.submitFeedback);

// Doctor Authentication
router.post('/doctor/register', mobileAuthController.register);
router.post('/doctor/login', mobileAuthController.login);
router.post('/doctor/update-profile', mobileAuthMiddleware, mobileAuthController.updateProfile);
router.post('/doctor/change-password', mobileAuthMiddleware, mobileAuthController.changePassword); 

// Doctor Profile & Schedule
router.post('/doctor/get-profile', mobileAuthMiddleware, doctorProfileController.getProfile);
router.post('/doctor/update-profile', mobileAuthMiddleware, doctorProfileController.updateProfile);
router.post('/doctor/toggle-service', mobileAuthMiddleware, doctorProfileController.toggleService);
router.post('/doctor/toggle-equipment', mobileAuthMiddleware, doctorProfileController.toggleEquipment);

// Doctor Appointments
router.post('/doctor/appointments/get', mobileAuthMiddleware, doctorAppointmentsController.getAppointments);
router.post('/doctor/requests/accept/:requestId', mobileAuthMiddleware, doctorAppointmentsController.acceptRequest);
router.post('/doctor/requests/cancel/:requestId', mobileAuthMiddleware, doctorAppointmentsController.cancelRequest);
router.post('/doctor/appointments/complete/:requestId', mobileAuthMiddleware, doctorAppointmentsController.completeAppointment);

module.exports = router;