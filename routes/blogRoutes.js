
const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs
} = require("../controllers/blogController");

router.post("/create", createBlog);
router.get("/", getAllBlogs);

module.exports = router;
