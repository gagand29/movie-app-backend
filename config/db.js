import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,  
  process.env.DB_USER,  
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST, // localhost
    dialect: "postgres",
    logging: false,
    port: process.env.DB_PORT 
  }
);

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log(" Connected to PostgreSQL"))
  .catch((error) => console.error("❌ Database Connection Failed:", error));

export default sequelize;
