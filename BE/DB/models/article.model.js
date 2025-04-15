import mongoose from "mongoose"

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    Image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    imagesDeleted:
    {
        type: Boolean,
        default: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approved:{
        type: Boolean,
        default: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvedAt: {
        type: Date
    }
})

const articleModel = mongoose.model("Article", articleSchema) || mongoose.models.Article

export default articleModel