import express from "express";
const router = express.Router();

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticationUser } from "../middleware/authentication.js";

router.route("/").post(authenticationUser, createReview).get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticationUser, updateReview)
  .delete(authenticationUser, deleteReview);

export default router;
