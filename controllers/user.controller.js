import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";
import { response200, response201, response400 } from "../utils/responseCodes.js"
import {pictureToUrl} from "../middlewares/pictureToUrl.js";

export const getUserProfile = async(req, res)=>{
    req.body.user.password = null;
    const posts = await Post.find({userId: req.body.user._id}).populate('userId', 'name email profilePic _id');
    
    req.body.user.profilePic = pictureToUrl(req, req.body.user.profilePic);
    req.body.user.profileBanner = pictureToUrl(req, req.body.user.profileBanner);

    return response200(res, "Profile sent", {profile: req.body.user, posts: posts});
}

export const getProfile = async(req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    user.password = null;

    user.profilePic = pictureToUrl(req, user.profilePic);
    user.profileBanner = pictureToUrl(req, user.profileBanner);

    const posts = await Post.find({userId: id}).populate('userId', 'name email profilePic _id');
    return response200(res, "Profile sent", {profile: user, posts: posts});
}

export const getAllUsers = async(req, res)=>{
    try {
        const userId = req.body.user._id;
        const users = await User.find({ _id: { $ne: userId } }).select(["_id", "name", "email", "profilePic"]);
        
        users.map((user)=>{
            user.profilePic = pictureToUrl(req, user.profilePic);
        })

        return response200(res, "Users sent", users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return response400(res, "Error fetching users");
    }
}

export const editProfile = async (req, res) => {
    try {
        const { name, location, age, bio, links, userId } = req.body;

        const updatedObj = { name, location, age, bio, links };
        // console.log(req.files.profileBanner);
        
        let profilePicFileName, profileBannerFileName;
        if(req.files.profilePic){
            // console.log(req.files.profilePic)
            let n = req.files.profilePic[0].path.split("\\");
            profilePicFileName = n[n.length - 1];
        }
        if(req.files.profileBanner){
            let m = req.files.profileBanner[0].path.split("\\");
            profileBannerFileName = m[m.length - 1];
        }

        if (req.files) {
            if (req.files.profilePic) {
                updatedObj.profilePic = `uploads/${userId}/${profilePicFileName}`;
            }
            if (req.files.profileBanner) {
                updatedObj.profileBanner = `uploads/${userId}/${profileBannerFileName}`;
            }    
        }

        const user = await User.findOneAndUpdate({ _id: userId }, updatedObj, { new: true });
        return response200(res, "User Updated", user);
    } catch (error) {
        console.error("Error updating user:", error);
        return response400(res, "Error updating user");
    }
}


export const follow = async(req, res)=>{
    const {_id} = req.body.user;
    const {id} = req.params;
    try{
        if(req.body.user.following.includes(id)){
            await User.findOneAndUpdate({_id:_id}, {$pull:{following: id}});
            await User.findOneAndUpdate({_id:id}, {$pull:{followers: _id}});
            return response201(res, "Unfollowed");
        }
        else{
            await User.findByIdAndUpdate({_id}, {$push:{following: id}});
            await User.findOneAndUpdate({_id:id}, {$push:{followers: _id}});
            return response201(res, "Followed");
        }
    }
    catch(error){
        console.log(error);
    }
}