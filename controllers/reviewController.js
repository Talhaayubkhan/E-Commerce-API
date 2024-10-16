import Review from "../models/ReviewModel.js";
import Product from "../models/ProductModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product found with this ${productId}`);
  }

  const alreadySubmittedReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmittedReview) {
    throw new BadRequestError(
      "You have already submitted a review for this product"
    );
  }
  req.body.user = req.user.userId;

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({
    reviews,
    count: reviews.length,
  });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({
    _id: reviewId,
  });
  if (!review) {
    throw new NotFoundError(`No review found with this ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, rating, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review found with this ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({
    _id: reviewId,
  });
  if (!review) {
    throw new NotFoundError(`No review found with this ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne();

  res.status(StatusCodes.OK).json({
    message: "Review deleted successfully",
  });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
