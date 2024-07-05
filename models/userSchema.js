import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    links:{
        type: String,
        default: ""      
    },
    bio:{
        type: String,
        default: ""
    },
    followers:{
        type: Array,
        default: []
    },
    following:{
        type: Array,
        default: []
    },
    bookmark:{
        type: Array,
        default: []
    },
    profilePic:{
        type:String,
        default: ""
    },
    profileBanner:{
        type:String,
        default: ""
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);