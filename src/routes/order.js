const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware.protect, orderController.createOrder);
router.get("/", authMiddleware.protect, orderController.getOrders);
router.get("/:id", authMiddleware.protect, orderController.getOrderDetails);

module.exports = router;
