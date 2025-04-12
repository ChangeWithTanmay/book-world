import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async(req, res) => {
    try {
        const { username, email, password } = req.body;
        return res.status(201).json({
            message: 'User created successfully',
            user: 'Testing user',
          });
          
    } catch (error) {
        
    }

});