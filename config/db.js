import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize sequelize with postgresql connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    port: process.env.DB_PORT,
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,  
      },
    } : {},
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to AWS RDS PostgreSQL"))
  .catch((error) => console.error("❌ Database Connection Failed:", error));

export default sequelize;
