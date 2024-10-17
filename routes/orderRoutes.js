import express from "express";
const router = express.Router();

import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  createOrder,
} from "../controllers/orderController.js";
import {
  authenticationUser,
  authorizedPermissions,
} from "../middleware/authentication.js";
router
  .route("/")
  .post(authenticationUser, createOrder)
  .get(authenticationUser, authorizedPermissions("admin"), getAllOrders);
router.route("/showAllMyOrders").get(authenticationUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authenticationUser, getSingleOrder)
  .patch(authenticationUser, updateOrder);

export default router;
