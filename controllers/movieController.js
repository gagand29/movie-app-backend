import * as movieService from "../services/movieService.js";

// Create Movie
export const createMovie = async (req, res) => {
    try {
        const { title, publishing_year } = req.body;
        const posterPath = req.file ? `/uploads/${req.file.filename}` : null;

        const movie = await movieService.createMovie(title, publishing_year, posterPath, req.user.id);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error creating movie", error });
    }
};

//  Get All Movies
export const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getUserMovies(req.user.id);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movies", error });
    }
};

// Get Single Movie
export const getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id, req.user.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie", error });
    }
};

// Update Movie
export const updateMovie = async (req, res) => {
    try {
        const { title, publishing_year } = req.body;
        const movieId = req.params.id;
        const userId = req.user.id;

        // Check if movie exists
        const movie = await movieService.getMovieById(movieId, userId);
        if (!movie) return res.status(404).json({ message: "Movie not found" });

        // Ensure publishing_year is correctly converted to an integer
        const year = publishing_year ? parseInt(publishing_year, 10) : movie.publishing_year;

        // Handle poster update properly
        const posterPath = req.file ? `/uploads/${req.file.filename}` : movie.poster_url;

        // Update the movie
        await movieService.updateMovie(movieId, userId, title, year, posterPath);

        res.json({ message: "Movie updated successfully", movie: { title, publishing_year: year, poster_url: posterPath } });
    } catch (error) {
        console.error("Update Movie Error:", error);
        res.status(500).json({ message: "Error updating movie", error });
    }
};



// Delete Movie
export const deleteMovie = async (req, res) => {
    try {
        await movieService.deleteMovie(req.params.id, req.user.id);
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting movie", error });
    }
};
