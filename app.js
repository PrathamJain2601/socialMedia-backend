import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import { response201 } from "./utils/responseCodes.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({path: ".env"});
const app = express();
databaseConnection();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin:"http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));

app.get("/", (req, res)=>{
    return response201(res, "Server is running");
});

import authRoutes from "./routes/auth.route.js"; 
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});