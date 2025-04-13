import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
            minlength: 3,
            maxlength: 20
        },
        email: {
            type: String,
            require: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
            maxlength: 12,
            trim: true,
        },
        profileImage: {
            type: String,
            default: ""
        },
        isEmailVarify: {
            type: Boolean,
            default: false
        },
        varificationToken: {
            type: String,
            length: 6
        },
        varificationTokenExpireAt: {
            type: Date
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true
    });

// Password Encrypt or Bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Password Compare
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Access Token Generate Function
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
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

export const User = mongoose.model("User", userSchema)