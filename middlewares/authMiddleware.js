import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to authenticate requests using JWT.
 * Verifies if the token is valid and attaches user details to the request.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    // Ensure the authorization header exists and is correctly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Authorization header missing or incorrect format" });
    }

    const token = authHeader.split(" ")[1];// Extract the token

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired. Please log in again." });
        }

        return res.status(403).json({ msg: "Invalid token" });
    }
};

export default authMiddleware;
