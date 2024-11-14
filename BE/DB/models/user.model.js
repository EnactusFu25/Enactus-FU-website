import mongoose from "mongoose"

const userSchema = mongoose.Schema({

    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    verifiedEmail:
    {
        type: Boolean,
        default: false
    },
    recoveryEmail:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    role:
    {
        type: String,
        required: true,
        enum: ["Admin", "HR", "Media"]
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("User", userSchema) || mongoose.models.User

export default userModel