import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

/**
 * User Model - Represents registered users in the database.
 * Stores basic user information like name, email, and hashed password.
 */

const User = sequelize.define("User", {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        autoIncrement: true,
        primaryKey: true
    },
    name: {  
        type: DataTypes.STRING,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false // Passwords should be securely hashed before storage
    },
});

export default User;  
