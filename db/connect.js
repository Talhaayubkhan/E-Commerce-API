import mongoose from "mongoose";
const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB Connection Successfully");
    })
    .catch((err) => {
      console.log("Error While Connecting To MongoDB", err.message);
    });
};

export default connectDB;
