import * as authService from "../services/authService.js";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication API
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.signup(name, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authService.login(email, password);

        // Send refresh token as an HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: "Login successful", accessToken });
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
};

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Invalid refresh token
 */
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ msg: "No refresh token found" });

        const accessToken = await authService.refreshAccessToken(refreshToken);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ msg: error.message });
    }
};

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user and clear refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
export const logout = (req, res) => {
    res.clearCookie("refreshToken"); // Clear refresh token cookie
    res.json({ msg: "Logged out successfully" });
};
