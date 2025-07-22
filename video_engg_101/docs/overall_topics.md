

# Introduction to Multimedia (4 hours)

- Video Aspects
    - Fps
    - Resolution
    - Bitrate
    - Low level data structure to represent video
- Color space
    - RGB
    - YUV
- Audio Basics
    - Sampling Rate
    - Bitrate
    - Bits per sample
    - Channels
    - Low level data structure to represent audio

**Goal of this section**

- Ability to generate arbitrary video and audio digital signals using any coding language
- Test the generated signal using ffmpeg/ffplay
- Generate raw video in YUV format and play it using ffmpeg/ffplay



# Digital Compression (6 hours)

- Basic Information theory Intuition
    - Entropy definition
    - Shannon's source coding theorem 
- Need for compression
- Lossless Compression
    - Huffman coding
    - LZW coding 
- Video Redundancies
    - Spatial Redundancies
    - Temporal Redundancies
- Video Encoder Block Diagram Discussion
- Types of frames I, P and B
- Run ffprobe to detect type of frames in a given video
- Audio Redundancies 
    - Frequency masking
- Audio Encoder Block Diagram Discussion


**Goal of this section**

- Appreciate intuitively as to what happens under the hood when we compress a video or audio
- Explore ffmpeg to compress a video or audio
- Highlevel anatomy of the compressed bitstream


# Container Formats (2 hours)

- Need for container formats
- Anatomy of mpegts 
- Anatomy of mp4
- Ffmpeg commands
    - Mux audio and video into a container
    - demux and extract audio and video from a container
    - Add new audio tracks to a container


# Streaming Protocols (6 hours)

- Types
    - Point to point like SRT webrtc rtmp
    - Broadcast like HLS, Mpeg-Dash
- Anatomy of HLS
    - Playlist
    - Manifest
    - Segment
    - Example HLS playlist explore 
- SRT (simple Reliable Transport)
    - Protocol overview 
    - Setup a SRT server using media-mtx or ffmpeg
- How can you stream rtmp to youtube
- CDN concepts and example setup

**Goal of this section**

- To be able to download videos from youtube and setup and simple VoD server similar to youtube
- To be able to write application to capture and send live stream to youtube
- Simulate lossy network between SRT listener and caller and study the ability to reliably transport with 
packet losses


# Metadata and AI (4 hours)

- What is metadata and why is it useful?
- Show and discuss lots of examples of metadata
- Some problems to discuss
    - Speech to text 
    - Automatic thumbnail extraction
    - Automatic thumbnail transformation
    - Brief text summary generation
    - Language detection 
    - Video Summarization

**Goal of this section**

- Create a collection of lecture video and create chapter links with brief summary of each chapter