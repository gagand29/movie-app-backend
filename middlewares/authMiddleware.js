import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Token is not provided" });
    }

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        // Attach user ID to request object correctly
        req.user = { id: decoded.userId };  // Ensure this matches the token payload

        next(); // Pass control to the next middleware
    } catch (error) {
        return res.status(403).json({ msg: "Token is not valid" });
    }
};

export default authMiddleware;
