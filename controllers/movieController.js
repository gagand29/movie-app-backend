import * as movieService from "../services/movieService.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management API
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *               publishing_year:
 *                 type: integer
 *               poster:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request
 */
export const createMovie = async (req, res) => {
    try {
        const { title, publishing_year } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const posterUrl = req.file.location;

        const movie = await movieService.createMovie(title, publishing_year, posterUrl, req.user.id);

        return res.status(201).json({ message: "Movie created successfully", movie });
    } catch (error) {
        console.error("Error creating movie:", error);
        return res.status(500).json({ message: "Error creating movie", error: error.message });
    }
};

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies for logged-in user
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of movies
 *       500:
 *         description: Server error
 */
export const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getUserMovies(req.user.id);
        return res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        return res.status(500).json({ message: "Error fetching movies", error: error.message });
    }
};

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */
export const getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id, req.user.id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        return res.status(200).json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        return res.status(500).json({ message: "Error fetching movie", error: error.message });
    }
};

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Updates movie details including title, publishing year, and poster image.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               publishing_year:
 *                 type: integer
 *                 example: 2010
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new poster image (optional)
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid request body or missing parameters
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export const updateMovie = async (req, res) => {
    try {
        const { title, publishing_year } = req.body;
        const movieId = req.params.id;
        const userId = req.user.id;

        // Check if movie exists
        const movie = await movieService.getMovieById(movieId, userId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        let posterUrl = movie.poster_url;
        if (req.file) {
            // **Delete old poster from S3 before uploading new one**
            const oldKey = movie.poster_url.split(".com/")[1];
            try {
                await s3.send(new DeleteObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: oldKey,
                }));
            } catch (deleteError) {
                console.warn("Error deleting old image from S3:", deleteError);
            }

            // Assign new S3 URL
            posterUrl = req.file.location;
        }

        // Update the movie
        const updatedMovie = await movieService.updateMovie(movieId, userId, title, publishing_year, posterUrl);

        return res.json({ message: "Movie updated successfully", movie: updatedMovie });
    } catch (error) {
        console.error("Error updating movie:", error);
        return res.status(500).json({ message: "Error updating movie", error: error.message });
    }
};

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Deletes a movie from the database and removes its associated poster from AWS S3.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export const deleteMovie = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id, req.user.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // **Delete image from S3**
        const key = movie.poster_url.split(".com/")[1];
        try {
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            }));
        } catch (deleteError) {
            console.warn("Error deleting image from S3:", deleteError);
        }

        // Remove movie from DB
        await movieService.deleteMovie(req.params.id, req.user.id);

        return res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        return res.status(500).json({ message: "Error deleting movie", error: error.message });
    }
};
