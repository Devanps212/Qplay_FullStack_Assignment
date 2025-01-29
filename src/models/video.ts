import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  uploadedAt: {
      type: Date,
      default: Date.now,
  },
  thumbnail:{
    type: String,
    required: true
  },
  formats: [
      {
          quality: {
              type: String,
              enum: ['240p', '480p', '720p', '1080p'],
              required: true,
          },
          fileUrl: {
              type: String,
              required: true,
          },
          size: {
              type: Number,
          },
          segments: [
              {
                  type: String,
              }
          ],
      }
  ],
  segments: [
      {
          segmentUrl: {
              type: String, 
              required: true,
          },
          duration: {
              type: Number,
              required: true,
          },
      },
  ],
  isActive: {
      type: Boolean,
      default: true,
  }
})


const videoModel = mongoose.model("videos", videoSchema)
export default videoModel
