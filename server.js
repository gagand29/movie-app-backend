import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import cookieParser from 'cookie-parser'; 
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';

// Importing Swagger docs
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

// Enable CORS with Credentials Support
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    credentials: true, // Allow sending cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Enable cookie parsing

// API routes
app.use("/", authRoutes);
app.use("/movies", movieRoutes);

// Swagger config 
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movie App API",
            version: "1.0.0",
            description: "API for managing movies",
        },
        servers: [
            {
                url: process.env.BACKEND_URL || "http://localhost:5001",
                description: "Local Server"
            },
            {
                url: process.env.PRODUCTION_BACKEND_URL || "http://your-ec2-public-ip:5001", //here
                description: "Production Server"
            },
        ],
    },
    apis: ["./routes/*.js","./controllers/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 5001;

// Initialize database and start the server
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synced");
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => console.error("Error syncing database", err));
