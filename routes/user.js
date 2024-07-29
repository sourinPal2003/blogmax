import express  from "express";
import User from "../models/user.models.js";

const userRouter = express.Router();

userRouter.get("/signin", (req, res) => {
    res.render("signin");
});


userRouter.get("/signup", (req, res) => {
    res.render("signup");
});

userRouter.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

userRouter.post("/signup", async (req, res) => {
    
    const {fullName, email, password} = req.body;
    await User.create({
        fullName, email, password
    });

    return res.redirect("/user/signin");
});

userRouter.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("user:", token);
    return res.cookie("token", token).redirect("/");
    } catch (e) {
        return res.render("signin", {signInError: e.message});
    }
    
});





export default userRouter
