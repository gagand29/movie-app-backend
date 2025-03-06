import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

/**
 * Movie Model - Represents a movie in the database.
 * Each movie is linked to a user and contains a title, publishing year, and a poster URL.
 */
const Movie = sequelize.define('Movie', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    publishing_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    poster_url: {
        type: DataTypes.STRING,
        allowNull: false // URL to the poster stored in S3
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE', // user is deleted, their movies are deleted
        allowNull: false
    }

});
export default Movie;