
const db = require("../config/db");

// CREATE BLOG
const createBlog = (req, res) => {
    const { user_id, title, content } = req.body;

    if (!user_id || !title || !content) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const checkUser = "SELECT id FROM users WHERE id = ?";

    db.query(checkUser, [user_id], (err, users) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const sql = `
            INSERT INTO blogs (user_id, title, content)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [user_id, title, content], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Blog creation failed"
                });
            }

            res.status(201).json({
                message: "Blog created successfully",
                blogId: result.insertId
            });
        });
    });
};

// GET ALL BLOGS
const getAllBlogs = (req, res) => {
    const sql = `
        SELECT blogs.id, blogs.title, blogs.content,
               blogs.created_at, users.name AS author
        FROM blogs
        JOIN users ON blogs.user_id = users.id
        ORDER BY blogs.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch blogs"
            });
        }

        res.status(200).json({
            message: "Blogs fetched successfully",
            blogs: result
        });
    });
};

module.exports = {
    createBlog,
    getAllBlogs
};
