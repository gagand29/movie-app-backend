import Movie from "../models/Movie.js";

/**
 * Creates a new movie entry in the database.
 * @param {string} title - The title of the movie.
 * @param {number} publishing_year - The release year of the movie.
 * @param {string} posterPath - The URL of the movie poster stored in S3.
 * @param {number} userId - The ID of the user creating the movie.
 * @returns {object} - The created movie record.
 */
export const createMovie = async (title, publishing_year, posterPath, userId) => {
    return await Movie.create({
        title,
        publishing_year,
        poster_url: posterPath,
        user_id: userId
    });
};

/**
 * Retrieves all movies for a specific user.
 * @param {number} userId - The ID of the user whose movies should be retrieved.
 * @returns {array} - A list of movies belonging to the user.
 */
export const getUserMovies = async (userId) => {
    return await Movie.findAll({ where: { user_id: userId } });
};

/**
 * Retrieves a single movie by its ID and user ownership.
 * @param {number} id - The ID of the movie to retrieve.
 * @param {number} userId - The ID of the user who owns the movie.
 * @returns {object|null} - The movie record if found, otherwise null.
 */
export const getMovieById = async (id, userId) => {
    return await Movie.findOne({ where: { id, user_id: userId } });
};

/**
 * Updates a movie record with new details.
 * @param {number} id - The ID of the movie to update.
 * @param {number} userId - The ID of the user who owns the movie.
 * @param {string} title - The updated title of the movie.
 * @param {number} publishing_year - The updated release year.
 * @param {string|null} posterPath - The updated URL of the movie poster (optional).
 * @returns {object} - The updated movie record.
 */
export const updateMovie = async (id, userId, title, publishing_year, posterPath) => {
    return await Movie.update(
        { title, publishing_year, ...(posterPath && { poster_url: posterPath }) },
        { where: { id, user_id: userId } }
    );
};

/**
 * Deletes a movie from the database.
 * @param {number} id - The ID of the movie to delete.
 * @param {number} userId - The ID of the user who owns the movie.
 * @returns {number} - The number of deleted records (0 if none were deleted).
 */
export const deleteMovie = async (id, userId) => {
    return await Movie.destroy({ where: { id, user_id: userId } });
};
