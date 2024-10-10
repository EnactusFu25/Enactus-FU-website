import mongoose from "mongoose"

const requestSchema = mongoose.Schema({

    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected"]
    }
})

const requestModel = mongoose.model("Request", requestSchema) || mongoose.models.Request

export default requestModel