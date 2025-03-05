import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Ensure environment variables are loaded
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "fallback_refresh_secret";

// Log secret keys to verify they are loaded correctly (Remove in production)
console.log("JWT_SECRET:", JWT_SECRET ? "✅ Loaded" : "❌ MISSING");
console.log("REFRESH_SECRET:", REFRESH_SECRET ? "✅ Loaded" : "❌ MISSING");

// Generate Access Token (Short-lived)
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

// Generate Refresh Token (Long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

// Signup function
export const signup = async (name, email, password) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return { message: "User created successfully", userID: newUser.id };
};

// Login function
export const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid user or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid user or password");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
};

// Refresh Access Token
export const refreshAccessToken = async (refreshToken) => {
    try {
        if (!refreshToken) throw new Error("Refresh token is missing");

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        return generateAccessToken(decoded.userId);
    } catch (error) {
        console.error("Refresh Token Error:", error.message);
        throw new Error("Invalid or expired refresh token");
    }
};
