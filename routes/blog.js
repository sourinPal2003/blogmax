import express from "express";
import User from "../models/user.models.js";
import Blog from "../models/blog.models.js";
import Comment from "../models/comments.models.js";
import multer from "multer";
import path from "path";
import cloudinary from "../services/cloudinary.js";

const blogRouter = express.Router();


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage })


blogRouter.get("/addblog", (req, res) => {
    res.render("addBlog", {
        user: req.user
    });
});

blogRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({ blogId: id }).populate("createdBy");
    console.log(blog)
    res.render("viewBlog", {
        blog,
        user: req.user,
        comments
    });
});


// blogRouter.post("/addblog", upload.single('coverImage'), async (req, res) => {
//     const {title, body} = req.body;
//     const coverImage = req.file?.filename || "/images/default.png" ;

//     const blog = await Blog.create({
//         title,
//         body,
//         coverImageURL: `/uploads/${coverImage}`,
//         createdBy: req.user._id
//     });
//     res.redirect(`/blog/${blog._id}`);
// });

blogRouter.post("/addblog", upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    // const coverImage = "/images/default.png";
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                success: false
            })
        }

        const blog = await Blog.create({
            title,
            body,
            coverImageURL: result.secure_url,
            createdBy: req.user._id
        });
        res.redirect(`/blog/${blog._id}`);
        // res.status(200).json({
        //     success: true,
        //     data: result,
        //     url: result.secure_url,
        //     title,
        //     body
        // })
    })
})


blogRouter.post("/comment/:blogId", async (req, res) => {
    console.log(req.body)
    const { blogId } = req.params;
    const { content } = req.body;
    const comment = await Comment.create({
        content,
        blogId,
        createdBy: req.user._id
    });
    res.redirect(`/blog/${blogId}`);
    
});


export default blogRouter