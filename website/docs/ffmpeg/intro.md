---
title: Introduction to FFMPEG
---

# 🎞️ Introduction to FFmpeg

## 📌 What is FFmpeg?

**FFmpeg** is a powerful open-source command-line tool used for **processing audio and video**. It supports encoding, decoding, transcoding, muxing, demuxing, filtering, streaming, and playback. It is widely used in broadcasting, streaming, VOD platforms, and post-production workflows.

- Website: [https://ffmpeg.org](https://ffmpeg.org)
- License: LGPL/GPL

---

## 🛠️ Key Features

- Convert between virtually all audio and video formats
- Capture and record live audio/video
- Stream multimedia over networks
- Apply filters (scaling, cropping, watermarking)
- Extract or merge streams (audio/video/subtitles)
- Supports most popular codecs and containers

---

## 🚀 Installing FFmpeg

### On macOS (with Homebrew):

```bash
brew install ffmpeg
```

### On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install ffmpeg
```

### On Windows:

1. Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Add the `bin` folder to your system PATH

---

## 🧪 Basic Command Syntax

```bash
ffmpeg [input options] -i input_file [output options] output_file
```

Example:

```bash
ffmpeg -i input.mp4 output.avi
```

This converts an MP4 file to AVI.

---

## 🎬 Common FFmpeg Use Cases

### 1. **Convert Video Format**

```bash
ffmpeg -i input.mov output.mp4
```

### 2. **Extract Audio from Video**

```bash
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3
```

### 3. **Resize Video**

```bash
ffmpeg -i input.mp4 -vf scale=1280:720 output_720p.mp4
```

### 4. **Cut a Segment from a Video**

```bash
ffmpeg -i input.mp4 -ss 00:01:00 -to 00:02:00 -c copy clip.mp4
```

### 5. **Add Watermark**

```bash
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=10:10" output.mp4
```

---

## 🧰 Advanced Options

- **CRF (Constant Rate Factor)** for quality control:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4
```

- **Presets** (faster = lower quality, slower = better quality):

```bash
ffmpeg -i input.mp4 -preset slow output.mp4
```

- **Two-pass encoding** for better bitrate control:

```bash
ffmpeg -y -i input.mp4 -c:v libx264 -b:v 1000k -pass 1 -an -f mp4 /dev/null
ffmpeg -i input.mp4 -c:v libx264 -b:v 1000k -pass 2 -c:a aac output.mp4
```

---

## 🔍 Inspecting Media Files

```bash
ffmpeg -i input.mp4
```

Or use:

```bash
ffprobe input.mp4
```

---

## 📚 Resources

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [FFmpeg Wiki](https://trac.ffmpeg.org/)
- [Stack Overflow FFmpeg Tag](https://stackoverflow.com/questions/tagged/ffmpeg)

---

FFmpeg is a must-have tool in the video engineering toolkit. With just a few command-line arguments, it can perform tasks that would otherwise require complex software.

