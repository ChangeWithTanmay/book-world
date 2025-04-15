import { Book } from "../models/books.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addBook = asyncHandler(async(req, res) =>{

    //1. Body to find data.
    const {title, caption, rating} = req.body;

    // 2. Data comming or not.
    if(!title || !caption  || !rating){
        throw new ApiError(400, "Invalid your data (Title, Caption, Image, Rating).")
    }

    console.log("req:\n\n",req.file)

    const image = req.file?.path;

    console.log("Image: \n\n", image);

    // Image is comming or not.
    if(!image){
        throw new ApiError(400, 'Image is required');
    }

    // 3. Upload Cloudinary
    const bookImage = await uploadOnCloudinary(image);

    console.log("Hii....")

    if(!bookImage){
        throw new ApiError(400, 'Book image successfully not uploaded.');
    }

    console.log("\nBook Image:", bookImage);

    // 4. Create user object - Create entry in db(MongoDB NO-SQL)
    const book = await Book.create({
        title, 
        caption, 
        rating,
        image: bookImage?.url
    });

    console.log("Hii....")

    if(!book){
        throw new ApiError(500, 'Database error: Failed to Book upload data.')
    }

    // # Return responce
    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            book,
            "Book details uploaded successfully"
        )
    )
});

export {
    addBook,

}