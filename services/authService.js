import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Ensure environment variables are loaded correctly
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "fallback_refresh_secret";

/**
 * Generates a short-lived access token.
 * @param {number} userId - ID of the authenticated user
 * @returns {string} - JWT access token
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

/**
 * Generates a long-lived refresh token.
 * @param {number} userId - ID of the authenticated user
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * Registers a new user with name, email, and hashed password.
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password
 * @returns {object} - Success message with new user ID
 * @throws {Error} - If the user already exists
 */
export const signup = async (name, email, password) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return { message: "User created successfully", userID: newUser.id };
};

/**
 * Authenticates user login by verifying credentials and issuing tokens.
 * @param {string} email - User's email address
 * @param {string} password - User's plaintext password
 * @returns {object} - Access and refresh tokens
 * @throws {Error} - If email or password is incorrect
 */
export const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid user or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid user or password");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
};

/**
 * Generates a new access token using a valid refresh token.
 * @param {string} refreshToken - The JWT refresh token
 * @returns {string} - New access token
 * @throws {Error} - If refresh token is missing, invalid, or expired
 */
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
