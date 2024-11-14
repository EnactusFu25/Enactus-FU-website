import mongoose from "mongoose"
import { departments } from "../../src/utils/globalImports"

const applicationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    answers:
    [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String
        }
    }],
    email: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
        required: true
    },
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forms"
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    faculty:
    {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6]
    },
    firstTime:{
        type: Boolean,
        required: true
    },
    whyInterested: {
        type: String,
        required: true
    },
    commitment:{
        type: String,
        required: true
    },
    previousRole:{
        type: String
    },
    department:{
        type: String,
        required: true,
        enum: [departments.PM, departments.HR, departments.PR, departments.LSC, departments.Market, departments.Media, departments.Presentation, departments.BE, departments.FE, departments.DA]
    },
    secondDepartment:{
        type: String,
        enum: [departments.PM, departments.HR, departments.PR, departments.LSC, departments.Market, departments.Media, departments.Presentation]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    uploadedAt: {
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
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rejectedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvedAt: {
        type: Date
    }
})

const applicationModel = mongoose.model("Application", applicationSchema) || mongoose.models.Application

export default applicationModel