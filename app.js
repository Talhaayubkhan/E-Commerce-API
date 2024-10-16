import express from "express";
import "express-async-errors";
import "dotenv/config";
const app = express();

import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// database connect
import connectDB from "./db/connect.js";

//routes

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import producRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

// middleware
import { NotFoundError, errorHandlerMiddleware } from "./middleware/index.js";

// built-in middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("e-commerce api");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", producRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(NotFoundError);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

start();
