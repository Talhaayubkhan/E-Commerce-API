import Product from "../models/ProductModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";

import path from "path"; // Importing the path module
import { fileURLToPath } from "url"; // Importing fileURLToPath
import { dirname } from "path"; // Importing dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Correctly define __dirname

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({
    product,
  });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("reviews");
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  await product.deleteOne();

  res.status(StatusCodes.OK).json({
    msg: "Product deleted successfully",
  });
};
const uploadImage = async (req, res) => {
  // console.log(req.files);
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Invalid file type. Only images are allowed.");
  }
  const maxSize = 1024 * 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({
    message: "Image uploaded successfully",
    filePath: `/uploads/${productImage.name}`,
  });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
