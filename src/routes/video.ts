import expres from "express"
import { addVideo } from "../controller/videoController"
import upload from "../config/multerConfig"

const videoRouter = expres.Router()

videoRouter.post('/upload', upload.single("file"), addVideo)

export default videoRouter