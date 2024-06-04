import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./helpers/authMiddleware.js";
import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/userRouter.js";
import path from "node:path";

const DB_URI = process.env.DB_URI;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("./public/avatars")));

app.use("/users", authRouter);
app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/users", authMiddleware, userRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal server error" } = err;
  res.status(status).json({ message });
});

async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.info("Database connection successful");

    app.listen(3000, () => {
      console.log("Server is running on port: 3000");
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

run();
