import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';    
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5001;

sequelize
  .sync({ alter: true })
  .then(()=>{
    console.log("databse synced");
    app.listen(port,()=> 
    console.log(`Server running on port ${port}`));
  })
  .catch((err)=>console.error("error syncing database",err) );