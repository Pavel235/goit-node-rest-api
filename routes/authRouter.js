import express from "express";
import {
  userByToken,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/authSchemas.js";
import { authMiddleware } from "../helpers/authmiddleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(registerUserSchema),
  userRegistration
);

userRouter.post("/login", validateBody(loginUserSchema), userLogin);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/current", authMiddleware, userByToken);

export default userRouter;
