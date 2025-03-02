import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name: movie_app
  process.env.DB_USER,  // Database username: gagg
  process.env.DB_PASSWORD,  // Your PostgreSQL password
  {
    host: process.env.DB_HOST, // localhost
    dialect: "postgres",
    logging: false,// Disable SQL query logs
    port: process.env.DB_PORT 
  }
);

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((error) => console.error("❌ Database Connection Failed:", error));

export default sequelize;
