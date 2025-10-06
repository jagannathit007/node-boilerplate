const { Router } = require("express");
const { createUploadMiddleware } = require("../middlewares/file-uploader.js");
const { constants } = require("../config/constants.js");
const { adminAuthMiddleware } = require("../middlewares/admin-auth.js");
const  authController  = require("../controllers/admin/authentication.controller.js");
const servicesController  = require("../controllers/admin/service.controller.js")
const { specialtiesController } = require("../controllers/admin/specialties.controller.js");
const { doctorTypeController } = require("../controllers/admin/doctor-type.controller.js"); 
const { doctorsController } = require("../controllers/admin/doctors.controller.js");
const { patientsController } = require("../controllers/admin/patients.controller.js"); 
const { bannersController } = require("../controllers/admin/banners.controller.js");
const { staticPagesController } = require("../controllers/admin/static-pages.controller.js");

const router = Router();

const profileUpload = createUploadMiddleware(constants.UPLOADS.PROFILES).single('avatar');
const bannerUpload = createUploadMiddleware(constants.UPLOADS.BANNERS).single('image');

// Authentication (POST methods)
router.post('/register', profileUpload, authController.register);
router.post('/login', authController.login);
router.post('/change-password', adminAuthMiddleware, authController.changePassword);
router.post('/update-profile', adminAuthMiddleware, profileUpload, authController.updateProfile);
router.post('/get-user', adminAuthMiddleware, authController.getUser);

router.post('/services/create', adminAuthMiddleware, servicesController.createService);
router.post('/services/update', adminAuthMiddleware, servicesController.updateService);
router.post('/services/delete', adminAuthMiddleware, servicesController.deleteService);
router.post('/services/get', adminAuthMiddleware, servicesController.getServices);

// Equipment CRUD
router.post('/equipment/create', adminAuthMiddleware, equipmentController.createEquipment);
router.post('/equipment/update', adminAuthMiddleware, equipmentController.updateEquipment);
router.post('/equipment/delete', adminAuthMiddleware, equipmentController.deleteEquipment);
router.post('/equipment/get', adminAuthMiddleware, equipmentController.getEquipments);

// Doctor Types CRUD
router.post('/doctor-types/create', adminAuthMiddleware, doctorTypeController.createDoctorType);
router.post('/doctor-types/update/:id', adminAuthMiddleware, doctorTypeController.updateDoctorType);
router.post('/doctor-types/delete/:id', adminAuthMiddleware, doctorTypeController.deleteDoctorType);
router.post('/doctor-types/get', adminAuthMiddleware, doctorTypeController.getDoctorTypes);

// Doctors CRUD
router.post('/doctors/create', adminAuthMiddleware, doctorsController.createDoctor);
router.post('/doctors/get', adminAuthMiddleware, doctorsController.getDoctors);
router.post('/doctors/update/:id', adminAuthMiddleware, doctorsController.updateDoctor);
router.post('/doctors/delete/:id', adminAuthMiddleware, doctorsController.deleteDoctor);

// Patients CRUD
router.post('/patients/create', adminAuthMiddleware, patientsController.createPatient);
router.post('/patients/get', adminAuthMiddleware, patientsController.getPatients);
router.post('/patients/update/:id', adminAuthMiddleware, patientsController.updatePatient);
router.post('/patients/delete/:id', adminAuthMiddleware, patientsController.deletePatient);

// Banners CRUD
router.post('/banners/create', adminAuthMiddleware, bannerUpload, bannersController.createBanner);
router.post('/banners/update/:id', adminAuthMiddleware, bannerUpload, bannersController.updateBanner);
router.post('/banners/delete/:id', adminAuthMiddleware, bannersController.deleteBanner);
router.post('/banners/get', adminAuthMiddleware, bannersController.getBanners);

// Static Pages
router.post('/static-pages/update/:type', adminAuthMiddleware, staticPagesController.updatePage);
router.post('/static-pages/get/:type', adminAuthMiddleware, staticPagesController.getPage);

module.exports = router;