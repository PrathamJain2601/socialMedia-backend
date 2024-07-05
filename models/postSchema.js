import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    like:{
        type: Array,
        default: []
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bookmark:{
        type: Boolean,
        deefault: false,
    }
}, {timestamps: true});

export const Post = mongoose.model("Post", postSchema);