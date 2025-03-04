import Movie from "../models/Movie.js";

// Create a movie
export const createMovie = async (title, publishing_year, posterPath, userId) => {
    return await Movie.create({
        title,
        publishing_year,
        poster_url: posterPath,
        user_id: userId
    });
};

// Get all movies for the user
export const getUserMovies = async (userId) => {
    return await Movie.findAll({ where: { user_id: userId } });
};

// Get single movie
export const getMovieById = async (id, userId) => {
    return await Movie.findOne({ where: { id, user_id: userId } });
};

// Update a movie
export const updateMovie = async (id, userId, title, publishing_year, posterPath) => {
    return await Movie.update(
        { title, publishing_year, ...(posterPath && { poster_url: posterPath }) },
        { where: { id, user_id: userId } }
    );
};

// Delete a movie
export const deleteMovie = async (id, userId) => {
    return await Movie.destroy({ where: { id, user_id: userId } });
};
