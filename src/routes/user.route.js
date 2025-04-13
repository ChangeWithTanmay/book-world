import { Router } from "express";
import { 
    registerUser,
    varifyOTP,
    loginUser,
} from "../controllers/user.controller.js";  

const router = Router();

router.route('/register').post(registerUser);
router.route('/varify-otp').post(varifyOTP);
router.route('/login').post(loginUser);


export default router