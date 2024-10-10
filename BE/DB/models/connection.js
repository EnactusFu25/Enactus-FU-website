import mongoose from "mongoose"

export const connection = async () => {
    try {
        await mongoose.connect(process.env.LOCAL_DB, 
            console.log("Connected to MongoDB"))
    } catch (error) {
        console.log(error)
    }
}