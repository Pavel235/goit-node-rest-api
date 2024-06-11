import express from "express";
import {
  repeatVerify,
  userAvatar,
  verifyUserByToken,
} from "../controllers/usersController.js";
import uploadFile from "../helpers/upload.js";
import { authMiddleware } from "../helpers/authMiddleware.js";
import { emailSchema } from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";

const userRouter = express.Router();

userRouter.get("/verify/:verificationToken", verifyUserByToken);
userRouter.post("/verify", validateBody(emailSchema), repeatVerify);
userRouter.patch(
  "/avatars",
  authMiddleware,
  uploadFile.single("avatarURL"),
  userAvatar
);

export default userRouter;
