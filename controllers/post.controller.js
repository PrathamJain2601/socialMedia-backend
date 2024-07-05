import mongoose from "mongoose";
import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";
import { response200, response201, response400 } from "../utils/responseCodes.js";
import { pictureToUrl } from "../middlewares/pictureToUrl.js";

export const createPost = async(req, res)=>{
    const {content} = req.body;
    const {_id, name, email, profilePic} = req.body.user;
    if(!content){
        return response400(res, "Empty Content");
    }
    Post.create({
        userId: _id,
        content: content,
        userName: name,
        userEmail: email,
        userPic: profilePic
    });
    return response201(res, "Post created successfully");
}

export const deletePost = async(req, res)=>{
    const {id} = req.params;
    if(!id){
        return response400(res, "bad request");
    }
    const {_id} = req.body.user;
    
    await Post.findOneAndDelete({_id: id, userId:_id});
    
    return response201(res, "Post deleted successfully");
}

export const likePost = async(req, res)=>{
    const {id} = req.params;
    if(!id){
        return response400(res, "bad request");
    }
    const {_id} = req.body.user;
    const post = await Post.findOne({_id: id});

    if(post.like.includes(_id)){
        await Post.findOneAndUpdate({_id: id}, {$pull:{like: _id}});
        return response201(res, "Disliked successfully");
    }
    else{
        await Post.findOneAndUpdate({_id: id}, {$push:{like: _id}});
        return response201(res, "Liked successfully");
    }
}

export const bookmarkPost = async(req, res)=>{
    const {id} = req.params;
    if(!id){
        return response400(res, "bad request");
    }
    const {_id} = req.body.user;
    
    if(req.body.user.bookmark.includes(id)){
        await User.findOneAndUpdate({_id:_id}, {$pull:{bookmark: id}});
        return response201(res, "bookmark removed successfully");
    }
    else{
        await User.findOneAndUpdate({_id:_id}, {$push:{bookmark: id}});
        return response201(res, "Bookmarked successfully");
    }
}

function bookmarkCheck(req, myPosts) {
    const { bookmark } = req.body.user;

    // Check if bookmark is an array
    if (!Array.isArray(bookmark)) {
        throw new Error('bookmark should be an array');
    }

    myPosts.forEach((post) => {
        const postId = post._id.toString(); // Convert ObjectId to string
        if (bookmark.includes(postId)) {
            post.bookmark = true;
        } else {
            post.bookmark = false;
        }
    });

    return myPosts;
}

export const getRelevantPosts = async(req, res) =>{
    const {_id} = req.body.user;
    let myPosts = await Post.find({userId:_id}).populate('userId', 'name email profilePic _id');
    let othersPosts = await Promise.all(req.body.user.following.map((otherid) => {
        return Post.find({userId: otherid}).populate('userId', 'name email profilePic _id');
    }));
    myPosts = myPosts.concat(...othersPosts);
    myPosts = bookmarkCheck(req, myPosts);
    myPosts.map((myPost)=>{
        myPost.userId.profilePic = pictureToUrl(req, myPost.userId.profilePic);
    })
    response200(res, "Posts sent", myPosts);
}

export const getAllPosts = async(req, res) =>{
    const {_id} = req.body.user;
    const {id} = req.params;
    
    let myPosts;
    if(id == "home"){
        myPosts = await Post.find().populate('userId', 'name email profilePic _id');
    }
    else if(id == "user"){
        myPosts = await Post.find({userId:_id}).populate('userId', 'name email profilePic _id');
    }
    else{
        myPosts = await Post.find({userId:id}).populate('userId', 'name email profilePic _id') ;
    }
    
    myPosts.sort((a, b) => {
        let x = new Date(a.createdAt);
        let y = new Date(b.createdAt);

        if (x < y) return 1;
        if (x > y) return -1;
    });
    myPosts = bookmarkCheck(req, myPosts);
    myPosts.map((myPost)=>{
        myPost.userId.profilePic = pictureToUrl(req, myPost.userId.profilePic);
    })

    return response200(res, "Posts sent", myPosts);
}

export const getPost = async(req, res) =>{
    const {id} = req.params;
    let myPosts = await Post.find({_id:id}).populate('userId', 'name email profilePic _id');
    myPosts.map((myPost)=>{
        myPost.userId.profilePic = pictureToUrl(req, myPost.userId.profilePic);
    })
    return response200(res, "Posts sent", myPosts);
}