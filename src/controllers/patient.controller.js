import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerPatient = asyncHandler(async (req, res) => {
  return res.status(201).json({
    message: "User created successfully",
    user: "Testing user",
  });
});

export { registerPatient };
