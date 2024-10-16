import express from "express";
const router = express.Router();
import {
  authenticationUser,
  authorizedPermissions,
} from "../middleware/authentication.js";

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";

router
  .route("/")
  .get(authenticationUser, authorizedPermissions("admin"), getAllUsers);
router.route("/showMe").get(authenticationUser, showCurrentUser);
router.route("/updateUser").patch(authenticationUser, updateUser);
router.route("/updatePassword").patch(authenticationUser, updateUserPassword);
router.route("/:id").get(getSingleUser);

export default router;
