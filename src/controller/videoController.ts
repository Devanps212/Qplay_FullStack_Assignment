import { Request, Response } from "express";
import { exec } from "child_process";
import path from "path";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import videoModel from "../models/video";

const addVideo = async (req: Request, res: Response) => {
  try {
    const uniqueId = uuidv4()
    const videoPath = req.file?.path
    const outputPath = path.join(__dirname, '..', 'uploads', 'files', uniqueId)
    const hlsPath = `${outputPath}/index.m3u8`

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }

    const resolutions = [
      { width: 426, height: 240, bitrate: '400k', resolution: '240p' },
      { width: 640, height: 360, bitrate: '800k', resolution: '360p' },
      { width: 854, height: 480, bitrate: '1200k', resolution: '480p' },
      { width: 1280, height: 720, bitrate: '2500k', resolution: '720p' },
      { width: 1920, height: 1080, bitrate: '5000k', resolution: '1080p' }
    ]

    const hlsCommands = resolutions.map((res) => {
      const resolutionOutputPath = `${outputPath}/${res.resolution}`
      if (!fs.existsSync(resolutionOutputPath)) {
        fs.mkdirSync(resolutionOutputPath, { recursive: true })
      }

      return `ffmpeg -i ${videoPath} -vf "scale=${res.width}:${res.height}" -b:v ${res.bitrate} -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${resolutionOutputPath}/segment%03d.ts" -start_number 0 ${resolutionOutputPath}/index.m3u8`
    })

    exec(hlsCommands.join('&& '), async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ message: "Error processing video." })
      }

      const masterPlaylistPath = `${outputPath}/index.m3u8`
      let masterPlaylistContent = '#EXTM3U\n#EXT-X-VERSION:3\n'

      resolutions.forEach((res) => {
        masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${res.bitrate.replace('k', '')}000,RESOLUTION=${res.width}x${res.height}\n`
        masterPlaylistContent += `/${uniqueId}/${res.resolution}/index.m3u8\n`
      })

      fs.writeFileSync(masterPlaylistPath, masterPlaylistContent)

      const videoUrl = `${req.protocol}://${req.get('host')}/uploads/files/${uniqueId}/index.m3u8`
      
      const videoData = {
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        formats: resolutions.map((res) => ({
          quality: res.resolution,
          fileUrl: `${req.protocol}://${req.get('host')}/uploads/files/${uniqueId}/${res.resolution}/index.m3u8`,
          size: fs.statSync(`${outputPath}/${res.resolution}/index.m3u8`).size,
          segments: Array.from({ length: fs.readdirSync(`${outputPath}/${res.resolution}`).length - 1 }, (_, i) => 
            `${req.protocol}://${req.get('host')}/uploads/files/${uniqueId}/${res.resolution}/segment${String(i).padStart(3, '0')}.ts`
          ),
        })),
        segments: [
          {
            segmentUrl: videoUrl,
            duration: 0,
          },
        ],
        isActive: true,
      }

      const newVideo = new videoModel(videoData)
      await newVideo.save()

      res.status(201).json({
        message: 'Video uploaded and processed successfully.',
        video: newVideo,
      })
    })
  } catch (error) {
    res.status(500).json("Internal server error")
  }
}

export { addVideo }
