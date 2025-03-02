import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        autoIncrement: true,
        primaryKey: true
    },
    name: {  // ✅ Add name field
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
        allowNull: false
    },
});

export default User;  
