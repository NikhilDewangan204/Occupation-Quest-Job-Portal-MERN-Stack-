import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "This is a required field!"],
        minLength: [3, "Name must contains at least 3 characters!"],
    },
    email: {
        type: String,
        required: [true, "This is a required field!"],
        validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
        type: Number,
        required: [true, "This is a required field!"],
    },
    password: {
        type: String,
        required: [true, "This is a required field!"],
        minLength: [8, "Password must conatain at least 8 characters!"],
        maxLength: [32, "Password cannot exceed 32 Characters!"],
        select: false
    },
    role: {
        type: String,
        required: [true, "Please specify your role"],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
        type: Date,
        dafault: Date.now,
    },
});

// HASHING THE PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// COMPARING THE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// GENERATING A JWT TOKEN FOR AUTHORIZATION
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE, });
};

export const User = mongoose.model("User", userSchema );