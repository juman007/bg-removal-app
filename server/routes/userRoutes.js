import express from "express";
import { clerkWebHooks, userCredit } from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/webhooks", clerkWebHooks);
userRouter.get("/credits", authUser, userCredit);

export default userRouter;
