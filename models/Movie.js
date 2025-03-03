import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    }

});
export default Movie;