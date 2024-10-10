import mongoose from "mongoose"

const formSchema = mongoose.Schema({
    questions:
    [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["text", "MCQ"]
        },
        options: [{
            type: String
        }]
    }],
    department: {
        type: String,
        required: true
    }
})

const formModel = mongoose.model("Form", formSchema) || mongoose.models.Form

export default formModel