import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { response201 } from "./utils/responseCodes.js";
import cors from "cors";
import {createServer} from "http";
import { initializeSocket } from "./socket/initializeSocket.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({path: ".env"});
const app = express();
databaseConnection();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin:"http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:5173",
        credentials: true
    }
})

app.set("io", io);

app.get("/", (req, res)=>{
    return response201(res, "Server is running");
});

import authRoutes from "./routes/auth.route.js"; 
app.use("/auth", authRoutes);

import postRoutes from "./routes/post.route.js"; 
app.use("/post", postRoutes);

import userRoutes from "./routes/user.route.js"; 
app.use("/user", userRoutes);

initializeSocket(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log("Server running on port", PORT);
});