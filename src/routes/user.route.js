import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  varifyOTP,
  loginUser,
  logOutUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/varify-otp").post(varifyOTP);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);

export default router;
