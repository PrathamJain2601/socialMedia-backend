import { response400, response200, response201 } from "../utils/responseCodes.js";
import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async(req, res)=>{
    try{
        const authenticatedToken = req.cookies.token;
        if(authenticatedToken){
            const decode = jwt.verify(authenticatedToken, process.env.TOKEN_SECRET);
            const user = await User.findById(decode.userId);
            if(!user){
                return response400(res, "User not Authenticated");
            }
            req.body.user = user;
            return response201(res, "Loggedin Successfully");
        }
        const {name, email, password, location, age} = req.body;
        if(!name || !email || !password || !location || !age){
            return response400(res, "All fields are required");
        }
        const user = await User.findOne({email});
        if(user){
            return response400(res, "Email already exists");
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        const newuser = await User.create({
            name, email, password: hashedPassword, location, age
        });
        const token = jwt.sign({userId: newuser._id}, process.env.TOKEN_SECRET, {expiresIn: "30d"});
        res.cookie("token", token, {expiresIn:"30d", httpOnly: true});
        return response201(res, "Account created successfully");
    }
    catch(error){
        console.log(error);
    }
}

export const Login = async(req, res)=>{
    try{
        const authenticatedToken = req.cookies.token;
        // console.log(authenticatedToken);
        if(authenticatedToken){
            const decode = jwt.verify(authenticatedToken, process.env.TOKEN_SECRET);
            const user = await User.findById(decode.userId);
            if(!user){
                return response400(res, "User not Authenticated");
            }
            req.body.user = user;
            return response201(res, "Loggedin Successfully using cookie");
        }
        const {email, password} = req.body;
        if(!email || !password){
            return response400(res, "All fields are required");
        }
        const user = await User.findOne({email});
        if(!user){
            return response400(res, "Email doesn't exist");
        }
        const match = await bcryptjs.compare(password, user.password);
        if(!match){
            return response400(res, "Incorrect email or password");
        }
        const token = jwt.sign({userId: user._id}, process.env.TOKEN_SECRET, {expiresIn: "30d"});
        res.cookie("token", token, {expiresIn:"1d", httpOnly: true});
        return response201(res, "Loggedin successfully");
    }
    catch(error){
        console.log(error);
    }
}

export const Logout = (req, res)=>{
    try{
        res.clearCookie("token");
        response201(res, "Logged out successfully");
    }
    catch(error){
        console.log(error);
    }
}