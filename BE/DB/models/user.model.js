import mongoose from "mongoose"
import { systemRoles } from "../../src/utils/system-roles.js"

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
        enum: [systemRoles.ADMIN, systemRoles.HR, systemRoles.MEDIA]
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    },
    token: { type: String }
})

const userModel = mongoose.model("User", userSchema) || mongoose.models.User

export default userModel