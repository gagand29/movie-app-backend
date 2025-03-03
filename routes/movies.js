import express from 'express';
import multer from 'multer';
import path from 'path';
import Movie from '../models/Movie.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ Create a new movie
router.post("/", authMiddleware, upload.single("poster"), async (req, res) => {
    try {
        const { title, publishing_year } = req.body;

        const posterPath = req.file ? `/uploads/${req.file.filename}` : null;

        const movie = await Movie.create({
            title,
            publishing_year,
            poster_url: posterPath,  // ✅ Store the full path
            user_id: req.user.id
        });

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error creating movie", error });
    }
});


// ✅ Get all movies for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.findAll({ where: { user_id: req.user.id } });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movies", error });
    }
});

// ✅ Update a movie
router.put("/:id", authMiddleware, upload.single("poster"), async (req, res) => {
    try {
        const { title, publishing_year } = req.body;
        const posterPath = req.file? `/uploads/${req.file.filename}` : null;
        await Movie.update(
            { title, publishing_year, ...(posterPath && {poster_url: posterPath}) },
            { where: { id: req.params.id, user_id: req.user.id } }
        );
        res.json({ message: 'Movie updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error updating movie", error });
    }
});

// ✅ Delete a movie
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Movie.destroy({ where: { id: req.params.id, user_id: req.user.id } });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting movie", error });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
      const movie = await Movie.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!movie) return res.status(404).json({ message: "Movie not found" });
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movie", error });
    }
  });

export default router;
