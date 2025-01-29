import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinaryConfig'
import { v4 as uuidv4 } from 'uuid';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder:"Qplay Videos",
        resource_type: 'video',
        allowed_formats: ['mp4', 'avi', 'mkv'],
        public_id: (req: Request, file: Express.Multer.File) => {
            return `video-${uuidv4()}`;
        }
    } as {
        folder: string;
        resource_type: string;
        allowed_formats: string[];
      }
})

const upload = multer({storage: storage})

export default upload