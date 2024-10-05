import express from "express";
import { bookmarkPost, createPost, deletePost, getAllPosts, getPost, getRelevantPosts, likePost } from "../controllers/post.controller.js";
import isAuthorised from "../middlewares/isAuthorised.js"

const router = express.Router();
router.post("/create", isAuthorised, createPost);
router.delete("/delete/:id", isAuthorised, deletePost);
router.put("/like/:id", isAuthorised, likePost);
router.put("/bookmark/:id", isAuthorised, bookmarkPost);
router.get("/getRelevantPosts", isAuthorised, getRelevantPosts);
router.get("/getAllPosts/:id", isAuthorised, getAllPosts);
router.get("/getPost/:id", isAuthorised, getPost);

export default router;