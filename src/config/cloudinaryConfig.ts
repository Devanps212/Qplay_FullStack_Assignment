import { v2 as cloudinary } from 'cloudinary'
import configData from './config'


cloudinary.config({
    cloud_name: configData.CLOUD_NAME,
    api_key: configData.CLOUD_KEY,
    api_secret: configData.CLOUD_SECRET
})

export default cloudinary