import mongoose from 'mongoose'
import configData from './config'

const connectDB = async () => {
    try {
        await mongoose.connect(configData.MONGO_URI!)
        console.log("mongoDB connected")
    } catch (error: unknown) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDB
