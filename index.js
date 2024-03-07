import express, { Router } from "express";
import dotenv from "dotenv";
import mongoose, { get } from "mongoose";
import hotelsRoute from "./routes/hotels.js";
import authRoute from "./routes/auth.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

//Mongodb connection
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to Mongodb.");
  } catch (error) {
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb is disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("Mongodb is connected");
});

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/hotels", hotelsRoute);

//error handling
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "somthing went wrong";

  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

app.listen(process.env.port || 4000, () => {
  connect();
  console.log("Server is running on port 4000.");
});
