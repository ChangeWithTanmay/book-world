import { Book } from "../models/books.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const addBook = asyncHandler(async (req, res) => {
  //1. Body to find data.
  const { title, caption, rating } = req.body;

  // 2. Data comming or not.
  if (!title || !caption || !rating) {
    throw new ApiError(
      400,
      "Invalid your data (Title, Caption, Image, Rating)."
    );
  }

  const image = req.file?.path;

  // Image is comming or not.
  if (!image) {
    throw new ApiError(400, "Image is required");
  }

  // 3. Upload Cloudinary
  const bookImage = await uploadOnCloudinary(image);

  if (!bookImage) {
    throw new ApiError(400, "Book image successfully not uploaded.");
  }

  // 4. Create user object - Create entry in db(MongoDB NO-SQL)
  const book = await Book.create({
    title,
    caption,
    rating,
    image: bookImage?.url,
    user: req.user?._id,
  });

  if (!book) {
    throw new ApiError(500, "Database error: Failed to Book upload data.");
  }

  // # Return responce
  return res
    .status(201)
    .json(new ApiResponse(200, book, "Book details uploaded successfully"));
});

// Find Books

const getBooks = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const books = await Book.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username profileImage");

  if (!books) {
    throw new ApiError(500, "Server Error, Please re-try agn");
  }

  const totalBooks = await Book.countDocuments();

  if (!totalBooks) {
    throw new ApiError(500, "Server Error, Please re-try agn");
  }

  const totalPages = Math.ceil(totalBooks / limit);

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        books,
        currentPage: page,
        totalBooks,
        totalPages,
      },
      "Paggination successfully"
    )
  );
});

// Find All Book Post By current user.

const postBookByUser = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req?.user?._id }).sort({
    createdAt: -1,
  });

  if (!books) {
    throw new ApiError(500, "Server Error, Data Not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, books, "View All Post By user"));
});

// DELETE BOOK
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(402, "You not providing any id");
  }

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Your id is not id");
  }

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Your id is not exist.");
  }

  // check if user is the the create this post or not.
  if (book?.user?.toString() !== req?.user?._id.toString()) {
    throw new ApiError(401, "Bed request || You can't delete this book post");
  }

  const bookImage = book.image;

  const deleteBookPost = await book.deleteOne();

  if (!deleteBookPost) {
    throw new ApiError(500, "Post is not delete");
  }

  // delete post for cloudinary.
  const deleteImageUrl = await deleteOnCloudinary(bookImage);
  if (!deleteImageUrl) {
    throw new ApiError(
      500,
      "Ailed to delete the image due to a server error. Please try again later."
    );
  }

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        deleteBookPost,
      },
      "Book Post delete successfully."
    )
  );
});

export { addBook, getBooks, postBookByUser, deleteBook };
