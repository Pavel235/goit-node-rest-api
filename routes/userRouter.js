import express from "express";
import { userAvatar } from "../controllers/usersController.js";
import uploadFile from "../helpers/upload.js";

const userRouter = express.Router();

userRouter.patch("/avatars", uploadFile.single("avatarURL"), userAvatar);

export default userRouter;
