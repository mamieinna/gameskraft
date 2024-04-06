import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    googleSignIn:{
        type: Boolean,
        required: true,
        default: false,
    },
    podcasts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    favorits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    
      { timestamps: true }
);

export default mongoose.model("User", UserSchema);