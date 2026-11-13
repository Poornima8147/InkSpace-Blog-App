
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// USER REGISTRATION
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check empty fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing email
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const insertSql =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

            db.query(
                insertSql,
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Registration failed"
                        });
                    }

                    res.status(201).json({
                        message: "User registered successfully",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


// USER LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            // Compare password
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


// EXPORT FUNCTIONS
module.exports = {
    registerUser,
    loginUser
};
