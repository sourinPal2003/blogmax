import express from "express";
import { configDotenv } from "dotenv";
import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import Blog from "./models/blog.models.js";
import cookieParser from "cookie-parser";
import { checkforAuthCookie } from "./middlewares/auth.js";

configDotenv();



const app = express();
const PORT = process.env.PORT || 3612;

mongoose.connect(process.env.MONGO_URI)
.then(e=>console.log("MongoDB connected"))
.catch(e=>console.log("MongoDB error:",e));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(checkforAuthCookie("token"));
app.use(express.static(path.resolve("./public")));




app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user||null, //req.user insert in checkforAuthCookie
        allBlogs
    });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
    console.log(`Listening on: http://localhost:${PORT}`);
});







