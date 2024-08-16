const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/register/patient", authController.registerPatient);
router.post("/register/doctor", authController.registerDoctor);
router.post("/login", authController.login);

module.exports = router;
