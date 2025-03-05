import * as authService from "../services/authService.js";

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.signup(name, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Login Controller
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

// Refresh Token Controller
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

// Logout Controller
export const logout = (req, res) => {
    res.clearCookie("refreshToken"); // Clear refresh token cookie
    res.json({ msg: "Logged out successfully" });
};
