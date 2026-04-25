const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                user: sanitizeUser(user),
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed.",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select(
            "+password"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const isPasswordValid = await user.matchPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user: sanitizeUser(user),
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Login failed.",
        });
    }
};

const me = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Current user fetched successfully.",
        data: {
            user: sanitizeUser(req.user),
        },
    });
};

module.exports = {
    register,
    login,
    me,
};