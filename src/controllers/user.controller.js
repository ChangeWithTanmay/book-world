import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmailWithOtp } from "../utils/sendEmail.js";
import mongoose, { isValidObjectId } from "mongoose";
import validator from "validator";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Use -> Jwt
    // Step 1: Database থেকে user খুঁজে বের করা
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found"); // যদি user না থাকে
    }

    // Step 2: Access token এবং refresh token তৈরি করা
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Step 3: Refresh token database-এ save করা
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Step 4: Tokens return করা

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// #Register User

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Checking field

  if (!username || !email || !password) {
    throw new ApiError(401, "You are missing a details.");
  }

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  // Check username length max 3
  if (username < 3) {
    throw new ApiError(404, "Username min leangth is 3");
  }

  // check Email Address
  if (!validator.isEmail(email)) {
    throw new ApiError(404, "Invalid email address");
  }

  // User Already exist or not.
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    throw new ApiError(409, "Username & Email Already exist.");
  }

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

  const otp = generateOTP();

  // # Mail Sending.
  const sendOTP = await sendEmailWithOtp(email, otp);

  if (!sendOTP) {
    throw new ApiError(404, "Sending OTP error || OTP is not sending.");
  }

  // Add profile image
  const avater = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

  const user = await User.create({
    username,
    email,
    password,
    profileImage: avater,
    varificationToken: otp,
    varificationTokenExpireAt: Date.now() + 5 * 60 * 1000,
  });

  // 7#. Remove password and refresh token field from responce.

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8#. Check for user creation.

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // const { refreshToken } = await generateAccessAndRefreshTokens(user._id)

  // 9#. return Responce(res).

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        // Token: refreshToken,
        createdUser,
      },
      "User Register Successfully"
    )
  );
});

// ## Varify OTP

const varifyOTP = asyncHandler(async (req, res) => {
  const { otp, userId } = req.body;
  if (!otp || !userId) {
    throw new ApiError(404, "OTP and id is not provideing.");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  // Find the user with that ID
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User is not found");
  }

  // Check if OTP is expired
  if (user.varificationTokenExpireAt < Date.now()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  // Check if OTP matches
  if (user.varificationToken !== otp) {
    throw new ApiError(400, "Invalid OTP.");
  }

  const updateUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        isEmailVarify: true,
        varificationToken: null,
        varificationTokenExpireAt: null,
      },
    },
    { new: true }
  ).select("-password");

  if (!updateUser) {
    throw new ApiError(500, "User field not updated.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, updateUser, "User successfully Updated"));
});

// # Login User

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!password) {
    throw new ApiError(400, "Invalid password");
  }

  // If username or email not comming.
  if (!username && !email) {
    throw new ApiError(400, "Email and password is not comming.");
  }

  // 3#. username or email -> login
  const user = await User.findOne({
    // findOne is mongoDB finction.
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 4#. Password is check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 5#. Access and referesh Token -> user
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // 6#. Send cookie.
  // Filter which Data, User not return.
  // Far sai DataBase mai call kaiya hai. But eish ko update karka-bhi kam ho sakta hai.
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // sending cookies.
  const options = {
    httpOnly: true,
    secure: true,
    // kya farak parta hai: eish cookie ko, Front-end sai koivi chenge nahi karsakta. only chenge for back-end. Dakh sakta but modify nahi karsakta.
  };

  console.log(options);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// #logOut User
const logOutUser = asyncHandler(async (req, res) => {
  // cookie -> clear
  // refreshToken -> reset
  // own Middleware
  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // 2# cookie -> clear
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out."));
});

export { registerUser, varifyOTP, loginUser, logOutUser };
