const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");

const {
  cre_cashOrder,
  getOrders,
  getOrder_id,
  filterOrder,
  updateOrder_paid,
  updateOrder_delivered,
  createSession,
} = require("../controllers/orderControllers");

router.use(authController.auth);
router.get(
  "/checkout/:cartId",
  authController.permission("user"),
  createSession
);
router.route("/:cartId").post(authController.permission("user"), cre_cashOrder);
router.get(
  "/",
  authController.permission("user", "admin", "manager"),
  filterOrder,
  getOrders
);
router.get("/:id", getOrder_id);
router.put(
  "/:id/paid",
  authController.permission("admin", "manager"),
  updateOrder_paid
);
router.put(
  "/:id/deliver",
  authController.permission("admin", "manager"),
  updateOrder_delivered
);

module.exports = router;
