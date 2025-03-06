import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as movieController from "../controllers/movieController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();




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
 *     description: Allows an authenticated user to create a new movie with title, publishing year, and an optional poster.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - publishing_year
 *             properties:
 *               title: 
 *                 type: string
 *                 example: "Joker"
 *               publishing_year:
 *                 type: integer
 *                 example: 2019
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Optional poster image file
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, upload.single("poster"), movieController.createMovie);


/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve all movies for the authenticated user
 *     description: Fetches a list of movies created by the authenticated user.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of movies retrieved successfully
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, movieController.getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     description: Fetches details of a specific movie owned by the authenticated user.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details retrieved successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, movieController.getMovieById);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     description: Updates the title, publishing year, or poster of a movie owned by the authenticated user.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - publishing_year
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Dark Knight Rises"
 *               publishing_year:
 *                 type: integer
 *                 example: 2012
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Optional new poster image file
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Bad request (invalid input)
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, upload.single("poster"), movieController.updateMovie);


/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Removes a movie and its associated poster from the database and AWS S3.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, movieController.deleteMovie);

export default router;
