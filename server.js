import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';


//imprting swagger docs
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from'swagger-ui-express';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve the 'uploads' folder as a static directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//api routes
app.use("/", authRoutes);
app.use("/movies", movieRoutes);

//swagger config 
const swaggerOptions ={
  definition:{
    openapi: "3.0.0",
    info:{
      title: "Movie App API",
      version: "1.0.0",
      description: "API for managing movies",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local Server"
      },
      {
        url: "https://your-production-url.com",
        description: "Production Server"
      },
    ],
  },
  apis: ["./routes/*.js "],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 5001;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("Error syncing database", err));
