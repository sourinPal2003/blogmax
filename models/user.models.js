import mongoose from "mongoose";
import {createHmac, randomBytes} from "crypto";
import { createTokenForUser } from "../services/auth.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
},
{ timestamps: true });

userSchema.pre("save", function(next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    user.salt = salt;
    user.password = hashPassword;
    next();

})

userSchema.static ("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");
    const hashPassword = createHmac("sha256", user.salt).update(password).digest("hex");
    if(user.password !== hashPassword) throw new Error("Incorrect password");
    // return {...user.toObject(), password: undefined, salt: undefined};
    const token = createTokenForUser(user);
    return token;
}) 

const User = mongoose.model("user", userSchema);

export default User;