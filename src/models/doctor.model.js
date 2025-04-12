import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const doctorSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        username: {
            type: String,
            required: [true, "Please Doctor, enter your username."],
            unique: true,
            lowecase: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        specialty: {
            type: String,
            required: [true, 'Specialty is required.']
        },
        email: {
            type: String,
            unique: true,
            lowecase: true,
            trim: true
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        mobile: {
            type: String,
            required: true,
            unique: true
        },
        isMobileVerified: {
            type: Boolean,
            default: false
        },
        experience: {
            type: Number
        },
        avatarImage: {
            type: String, // cloudinary
        },
        age: {
            type: Number,
            min: 0
        },
        price: {
            type: Number
        },
        about: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'Password is requied.']
        },
        accountStatus: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

doctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


doctorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

doctorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            mobile: this.mobile,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
doctorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Doctor = mongoose.model("Doctor", doctorSchema);