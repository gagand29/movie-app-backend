import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // ✅ Import path module
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve the 'uploads' folder as a static directory
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

const port = process.env.PORT || 5001;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("Error syncing database", err));
