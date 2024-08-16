const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicine");

router.get("/", medicineController.getMedicines);
router.get("/:id", medicineController.getMedicineDetails);

module.exports = router;
