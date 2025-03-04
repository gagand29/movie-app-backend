import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Authorization header missing or incorrect format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request object
        req.user = { id: decoded.userId };

        next(); // Pass control to the next middleware
    } catch (error) {
        console.error("JWT Error:", error.message);

        // Check if the token is expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired. Please log in again." });
        }

        return res.status(403).json({ msg: "Invalid token" });
    }
};

export default authMiddleware;
