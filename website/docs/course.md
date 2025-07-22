---
sidebar_position: 2
title: Course Outline
---

A brief outline of the course of video engineering is described below.

# Course Details

1. ## Introduction to Multimedia and Digital Video (2hr)

A video processing signal chain is about color space conversions along the way. These conversions have to be done at the pixel rate, for example, consider HD resolution which is 1920 × 1080 with 60 fps (frames per second). i.e. 1920 × 1080 × 60 pixels are coming in each second, which means 124.4 million pixels in each second.  Any operation that needs to be done on the bits of one pixel must be done so fast that the same operation can be done on 124.4 million pixels in the space of one second. In other words the frequency is 124.4 Mhz. In reality this is around 148 Mhz since we must account for the timing information in each video frame. A color plane refers to the bits associated with each color R, G or B, for example. Let’s say 8 bits for each color plane and let’s assume simple RGB color planes. Going back to the processing speed, each pixel’s 24 bits have to be manipulated at a frequency of 148 Mhz. If you use an 8-bit DSP, which can manipulate 8 bits, then you have to run this DSP at 3 × 148 Mhz to keep up with the pixels coming in. In practice HD video manipulation would normally be done on a 32-bit DSP or processor. This topic looks into the signal processing of video and audio that form part of a video signal.  
Other key aspects of video processing are Color space (RGB, YUV),  Resolution, Frame rate, Interlaced and Deinterlaced. The color is represented carelessly and incorrectly as luminance (known as luma)  which is actually an approximation of lightness (denoted *Y*'), which is a weighted sum of *nonlinea*r (gamma-corrected) *R*', *G*', and *B*' components. The remaining letters (U and V), carry color information which is an approximation of red and blue color differences. The video is served in different sizes (resolution) to match with the explosion of video capturing and video rendering devices accelerated by mobile phone revolution. The frame rate is to do more with legacy than technology where different systems fixated on specific frame rates due to different reasons. Interlacted and deinterlaced encoding was another intuitive way to reduce the amount of video data processing at storage and transmission. This topic is the continuation of signal processing, where the nuances of video processing are explored.

- Signal Processing fundamentals  
  - Video Signal  
  - Audio Signal  
    - Sampling rate  
    - Produce a simple tone  
- Video Basics  
  - Color space: RGB, YUV  
  - Resolution  
  - Frame rate  
  - Interlaced and Deinterlaced

2. ## Video Compression and Codecs (3hr)

In all video programs, there are two types of components in the signal: those that are novel and unpredictable and those that can be anticipated. The novel component is called entropy and is the true information in the signal. Redundancy can also be temporal as it is where similarities between successive pictures are used. All compression systems work by separating entropy from redundancy in the encoder. Only the entropy is recorded or transmitted and the decoder computes the redundancy from the transmitted signal. In a simple way, there are similar areas within a single frame and there are similar areas between different frames of video. The areas that are different are ‘entropy’, and areas that are similar are ‘redundant’. This is the core and starting point of the journey through video compression (encoding) and decompression (decoding). The codec is formed with enCODECode, which is an amalgam of words \- encode and decode. The compression is old and is continuously evolving to match with growing video needs in the world. While working on video for mass consumption through different mediums \- TV, mobile, internet \- it is necessary to understand decades old methods to the new age methods. This topic takes a journey through the legacy compression techniques used for traditional TV broadcasting to the latest technologies used for streaming video content.

- What is Video Compression?  
- How does video codec work?  
  - predict  
    - transform+quantization  
    - Encoding  
  - Video Compression Standards  
    - H264  
    - HEVC

3. ## Video Containers and Ffmpeg (2hr)

There is more video at rest than the video that is being played out at any time. And there is more video content at rest than any other types of content (audio, images, documents, prints). Both these claims are guesses and without data to substantiate the fact. \[Language is 6000 years old, print is 600, moving image is 130 years, yet it surpasses all other mediums for sharing information\] Nevertheless, storing video is an important concept regarding video processing. A video container is like a digital packaging system that holds everything needed to play a video: the compressed video file, audio tracks, subtitles, and sometimes metadata like chapters or closed captions. Yes, there is more to video than images and audio, which are referred to as essence and add more dimension to video. MP4, MKV, AVI, and MOV are some of the generally known container formats in the web and outside. Learning about containers helps one to get closer to the video that is regularly handled by everybody as a file.  
FFMPEG \- arguably one of the best open source projects ever created. The video industry will not be where it is today without FFPEG. When open source software took the software industry where it is today, FFMPEG single handedly provided similar contributions to the video industry. This is more a tribute to FFMPEG than a topic to learn, and also to appreciate the real strength of the open source ecosystem.

- Why are containers required  
- Example COntainers  
  - MP4  
  - Mpegts  
- Explore ffmpeg commands to create video in above container formats

4. ## Streaming Technology (3hr)

   With the internet came an explosion of consuming devices and hooked billions of people to video on those devices. But carrying video signals across the globe over the internet backbone is not an easy task, given the large amount of bandwidth required to transmit video. Streaming is a general term used to cover the broad ways video is carried across the internet. Be it  through inventive use of a combination of datagram packets and connection oriented packets, or tiny video files served over HTTP, these technologies, standards and protocols allow millions to create video and to share with billions on the earth. These topics provide a glimpse of technologies that are working tirelessly and improving on each iteration to match the demand from a world where more and more are producing video everyday and more and more are consuming everyday.  
- What is streaming?  
  - Point to point  
    - RTMP  
    - SRT  
- Web Streaming  
  - HLS  
  - MPEGDash  
- SRT Deep dive  
  - Initial Handshake  
  - Packet Structure  
  - Latency maintenance strategies  
- HLS deep dive  
  - HLS ladder explanation, multi resolution example  
  - Manifest file format  
  - HLSv4 example stream dump analysis

5. ## Metadata and AI (2hr)

   Think about watching a continuous stream of  videos without titles, synopsis, intro or outro, or any other information about the video. Metadata cures that blandness, whether it is EPG (TV program schedule saying what is playing now, what will play next or later), movie or series or season or episode posters, interesting synopsis that hook viewers to a program, trailers, highlights, promos. Metadata was where humans understood and described the video through texts, pictures and short videos. When the scale of video creation increases exponentially, there is an unmet need to describe these videos for its viewers. And this is an area ripe for applying machine learning and AI generated content description at scale. This topic explores the metadata used in the industry and further explores the opportunities for using varying machine learning techniques.  
     
- Definitions of metadata title, stt, ocr, face rekognition  
- STT extraction

6. ## Assessment (3hr)

   Assessment is not about the mastery of the domain, but rather about the appreciation of the breadth and depth of the domain; and while also considering an individual's limitations to grasp all in one go, it is about validating the sheer interest in the domain. The domain is without doubt the largest form of content ever produced or consumed by humans than any other forms of content \- spoken, written…

# Study Resources

- [https://www.slideshare.net/slideshow/introduction-to-video-compression-13394338/13394338](https://www.slideshare.net/slideshow/introduction-to-video-compression-13394338/13394338)  


