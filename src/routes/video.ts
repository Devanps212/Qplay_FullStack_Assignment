import expres from "express"
import { addVideo, getVideos } from "../controller/videoController"
import upload from "../config/multerConfig"

const videoRouter = expres.Router()

videoRouter.post('/upload', upload.single("file"), addVideo)
videoRouter.get('/getVideos', getVideos)

export default videoRouter