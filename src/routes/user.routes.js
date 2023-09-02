import express from "express";
import { authUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", authUser);

export default userRouter;
