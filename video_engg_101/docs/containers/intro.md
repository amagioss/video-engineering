---
title: Introduction
---

# 📦 Major Video Container Formats

## 🎬 What is a Video Container?

A **video container** (or wrapper) is a file format that **bundles audio, video, subtitles, metadata**, and other data into a single file. Containers do **not compress** the media themselves — that's the job of **codecs** — but they define how that compressed data is **stored, synchronized, and played back**.

---

## 📦 Common Video Container Formats

| Container | Extension | Common Codecs              | Best Use Cases             | Notes |
|-----------|-----------|----------------------------|----------------------------|-------|
| **MP4**   | `.mp4`    | H.264, H.265, AAC, MP3     | VOD, streaming, mobile     | Most widely supported; works with HLS, DASH |
| **MKV**   | `.mkv`    | H.264, VP9, AV1, AAC, Opus | Archiving, offline playback| Open format; supports rich subtitles, multiple audio tracks |
| **MOV**   | `.mov`    | H.264, ProRes, AAC         | Apple ecosystem, editing   | Developed by Apple; used in Final Cut Pro |
| **AVI**   | `.avi`    | MPEG-4, DivX, MP3          | Legacy playback            | Old format; limited subtitle and streaming support |
| **WebM**  | `.webm`   | VP8, VP9, Opus, Vorbis     | Web streaming              | Royalty-free; not widely supported on iOS Safari |
| **FLV**   | `.flv`    | H.264, MP3                 | Legacy Flash video         | Deprecated, but used historically in RTMP |
| **TS**    | `.ts`     | H.264, AAC, AC-3           | Broadcasting, HLS streaming| Segment-friendly; resilient to packet loss |
| **MPEG-PS** | `.mpg`, `.mpeg` | MPEG-1, MPEG-2    | DVDs, legacy streams       | Low flexibility; legacy format |
| **OGG**   | `.ogv`, `.ogg` | Theora, Vorbis         | Open-source use cases      | Limited adoption outside Linux communities |
| **ASF**   | `.asf`    | WMV, WMA                   | Microsoft streaming        | Used with Windows Media Player/Silverlight |

---

## 🧠 Key Considerations When Choosing a Container

- **Compatibility**: MP4 has the broadest support across platforms and browsers.
- **Subtitles**: MKV is great for multi-language tracks and rich subtitle formats.
- **Streaming**:
  - HLS prefers `.ts` or fragmented MP4 (`.m4s`)
  - MPEG-DASH supports `.mp4`, `.webm`, or CMAF
- **Editing**: MOV and MXF are used in professional post-production.

---

## 📌 Special Mentions

- **M4V**: Variant of MP4 used by Apple, sometimes with DRM.
- **M2TS**: Blu-ray container format based on MPEG-TS.
- **FMP4 (Fragmented MP4)**: Used in CMAF workflows for low-latency streaming.

---

