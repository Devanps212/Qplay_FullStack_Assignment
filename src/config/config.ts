import dotenv from 'dotenv'

dotenv.config()

const configData = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_KEY: process.env.CLOUD_KEY,
    CLOUD_SECRET: process.env.CLOUD_SECRET_KEY
}

export default configData