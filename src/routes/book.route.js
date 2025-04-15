import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addBook } from "../controllers/book.controller.js";

const router = Router();

router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file.

router.route('/').post(upload.single("image"), addBook);


export default router