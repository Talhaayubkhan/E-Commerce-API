import Order from "../models/OrderModel.js";

import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";
import Product from "../models/ProductModel.js";

const fakeStripeAPI = ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};
const createOrder = async (req, res) => {
  const { items: cartItems, shippingFee, tax } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Missing tax or shipping fee");
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with id : ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItems = {
      product: _id,
      name,
      price,
      image,
      amount: item.amount,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItems];
    // calculate subtotal
    subTotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subTotal;
  const paymentIntent = fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  // create Order
  const order = await Order.create({
    orderItems,
    subTotal,
    tax,
    total,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.client_secret });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({
    orders,
    count: orders.length,
  });
};

const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  createOrder,
  getSingleOrder,
  getAllOrders,
  getCurrentUserOrders,
  updateOrder,
};
