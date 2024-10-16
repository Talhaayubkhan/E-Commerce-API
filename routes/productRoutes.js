import express from "express";
const router = express.Router();

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProduct,
} from "../controllers/productController.js";
import {
  authenticationUser,
  authorizedPermissions,
} from "../middleware/authentication.js";

router
  .route("/")
  .post([authenticationUser, authorizedPermissions("admin"), createProduct])
  .get(getAllProducts)
  .get(getAllProducts);

router.route("/image").post(uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticationUser, authorizedPermissions("admin")], updateProduct)
  .delete([authenticationUser, authorizedPermissions("admin")], deleteProduct);

export default router;
