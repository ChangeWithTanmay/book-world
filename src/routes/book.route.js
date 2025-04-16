import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addBook,
  getBooks,
  deleteBook,
  postBookByUser,
} from "../controllers/book.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file.

router.route("/").post(upload.single("image"), addBook);

// example call from react native - frontend
// const response = await fetch("http://localhost:8052/api/books?page=1&limit=5");
router.route("/").get(getBooks);
router.route("/user").get(postBookByUser);

router.route("/:id").delete(deleteBook);

export default router;
