---
sidebar_position: 1
title: Video Engg - Terms
---

# Introduction

This document serves as a primer for learning the core concepts, tools, and workflows involved in **Video Engineering**.

---

## 📹 Core Concepts

- **Video Signal**: Analog vs. Digital, Interlaced vs. Progressive
- **Resolution**: SD, HD, Full HD, 4K, 8K
- **Frame Rate**: 24fps, 30fps, 60fps, Variable Frame Rate (VFR)
- **Aspect Ratio**: 4:3, 16:9, 21:9
- **Bitrate**: CBR (Constant Bit Rate), VBR (Variable Bit Rate)
- **Chroma Subsampling**: 4:4:4, 4:2:2, 4:2:0
- **Color Space**: RGB, YUV, Rec. 709, Rec. 2020
- **HDR**: High Dynamic Range (HDR10, Dolby Vision, HLG)

---

## 🧪 Compression & Encoding

- **Video Codecs**: H.264 (AVC), H.265 (HEVC), VP9, AV1, VVC
- **Audio Codecs**: AAC, MP3, Opus, AC-3
- **Container Formats**: MP4, MKV, MOV, TS, WebM
- **GOP Structure**: I-frame, P-frame, B-frame
- **Encoding Settings**:
  - CRF (Constant Rate Factor)
  - Presets (ultrafast to placebo)
  - Profiles (baseline, main, high)
  - Levels (e.g., 4.0, 5.1)

---

## 🔁 Transcoding & Video Processing

- **Transcoding**: Re-encoding to change codec or resolution
- **Remuxing**: Changing the container without re-encoding
- **Filters**: Denoising, scaling, cropping, deinterlacing
- **Resolution Scaling**: Upscaling (480p → 1080p), Downscaling

---

## 🌐 Streaming & Delivery

- **Streaming Protocols**:
  - HLS (HTTP Live Streaming)
  - MPEG-DASH
  - RTMP (Real-Time Messaging Protocol)
  - SRT (Secure Reliable Transport)
- **Adaptive Bitrate (ABR) Streaming**:
  - Multi-resolution playlist with bitrate switching
- **DRM (Digital Rights Management)**:
  - Google Widevine, Microsoft PlayReady, Apple FairPlay
- **CDNs (Content Delivery Networks)**:
  - Akamai, Cloudflare, Fastly

---

## ⚙️ Playback & Devices

- **Popular Video Players**:
  - ExoPlayer (Android), AVPlayer (iOS), Shaka Player, Video.js
- **Decoding**:
  - Software decoding (CPU)
  - Hardware decoding (GPU/DSP)
- **Latency Types**:
  - Startup delay, rebuffering events, end-to-end latency
- **Captions/Subtitles**:
  - SRT, WebVTT, CEA-608/708 (closed captions)

---

## 📊 Metrics & Monitoring

- **Quality of Experience (QoE)**:
  - Playback start time, buffering frequency, video resolution
- **Quality of Service (QoS)**:
  - Bitrate, dropped frames, download speed
- **Monitoring Tools**:
  - Real-time analytics, SDK-based instrumentation

---

## 🧰 Common Tools

- **FFmpeg**: Command-line tool for video processing
- **GStreamer**: Modular multimedia pipeline
- **OBS Studio**: Live streaming and recording software
- **Wirecast / vMix**: Live video production tools
- **Audacity**: Visualize audio and be able to do some frequency analysis

---

## 🧭 Suggested Learning Modules

1. **Introduction to Digital Video and Signals**
2. **Codecs and Compression Techniques**
3. **Streaming Protocols and Architectures**
4. **Video Processing and Transcoding Tools**
5. **Player Design and Optimization**
6. **Monitoring and Quality Assurance**
7. **Advanced Topics**: AV1, VVC, Ultra-low-latency streaming

---

## 🎓 For Further Learning

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Bitmovin Video Developer Blog](https://bitmovin.com/video-developer-blog/)
- [OTTVerse Video Tech Guide](https://ottverse.com/)
- [Shaka Player Docs](https://shaka-player-demo.appspot.com/docs/api/)

---
