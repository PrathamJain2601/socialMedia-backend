import express from "express";
import isAuthorised from "../middlewares/isAuthorised.js"
import { editProfile, follow, getAllUsers, getProfile, getUserProfile } from "../controllers/user.controller.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.body.userId;
        const userDir = path.join(__dirname, '../uploads', userId);

        if (!fs.existsSync(userDir)){
            fs.mkdirSync(userDir, { recursive: true });
        }

        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();
router.get("/getUserProfile", isAuthorised, getUserProfile);
router.get("/getProfile/:id", isAuthorised, getProfile);
router.get("/getAllUsers", isAuthorised, getAllUsers);
router.put("/follow/:id", isAuthorised, follow);
router.put("/editProfile", isAuthorised, upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), editProfile);

export default router;