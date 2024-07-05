import jwt from "jsonwebtoken";
import { response400 } from "../utils/responseCodes.js";
import { User } from "../models/userSchema.js";

const isAuthorised = async(req, res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return response400(res, "User not Authenticated");
        }
        // console.log(token);
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decode.userId);
        if(!user){
            return response400(res, "User not Authenticated");
        }
        req.body.user = user;
        next();
    }
    catch(error){
        console.log(error);
    }
}

export default isAuthorised;