import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import configData from './config/config'
import connectDB from './config/db'
import videoRouter from './routes/video'
import path from 'path'

const PORT = configData.PORT || 5000

const app = express()
connectDB()


const options = {
    origin: configData.FRONTEND_URL,
    methods: ['POST', 'GET'],
    exposedHeaders: [
        "Cross-Origin-Opener-Policy",
        "Cross-Origin-Resource-Policy",
        "Access-Control-Allow-Origin",
    ]
}


app.use(morgan("dev"))
app.use(cors(options))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.use('/', videoRouter)

app.listen(PORT, ()=>{
    console.log("server listening on PORT", PORT)
})