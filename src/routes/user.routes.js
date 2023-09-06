import express from "express";
import {
  authUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", authUser);
userRouter.post("/profile", protect, updateUserProfile);

export default userRouter;
