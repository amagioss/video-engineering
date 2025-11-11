# Project Proposals

## 1. HLS Monitoring Dashboard

**Description:** Build an HLS monitoring dashboard using [hls-monitor](https://github.com/Eyevinn/hls-monitor) to monitor live streams and analyze latency.

**Expectations:**
- Create a small web application where users can choose and add HLS source URLs
- On clicking a source URL, display a dashboard showing the health of the stream
- Generate sprite images for the stream and display them in the dashboard
- Display and explain various metrics and errors that the HLS monitor is observing
- Monitor live streams and analyze latency

---

## 2. Video Search Engine Based on Speech-to-Text

**Description:** Create a web page to search videos based on speech-to-text data. The landing page should have a search box. When a user searches for a query, the best video clips from YouTube should be surfaced.

**Expectations:**
- A simple web page with a search box and a button to search for video clips in a given YouTube channel
- When a user searches for a query, surface the best matching video clips from YouTube (not just full videos, but specific clips)
- Use YouTube's subtitle data to create logical chapters
- Build a search engine for the videos
- Example: If searching for "law of conservation of energy", the best YouTube video clip URLs should surface
- You could build a clip index using Walter Lewin physics lecture series as a reference dataset

---

## 3. Multi-View Stream Stitching

**Description:** Take live streams from different camera sources and stitch them as a single stream with multi-view monitoring in real time.

**Expectations:**
- An application (either web or command line) that can take up to 16 video streams as input
- Stitch the streams together as a single combined stream
- Provide real-time multi-view monitoring

---

## 4. Live Stream Publishing to Twitch

**Description:** Create a video stream (preferably live using a camera, potentially mobile) and publish events from a college to the Twitch platform.

**Expectations:**
- Set up a live video stream from a camera source (mobile or other)
- Publish the stream to Twitch platform
- Handle event-based streaming scenarios (e.g., college events)

---

## 5. WebRTC Video Chat Application

**Description:** Explore WebRTC and create a video chat application.

**Expectations:**
- Implement one-to-one video chat functionality
- Implement group video chat functionality
- Use WebRTC technology for peer-to-peer communication

---

## 6. Video Editor with Filters

**Description:** Create a video editor application with well-known filters.

**Expectations:**
- Build a video editor application
- Implement filters such as:
  - Oil paint filter
  - Tetris filter
  - Other creative filters

---

## 7. AV Sync Detection

**Description:** Detect audio-video synchronization issues in a video file.
Example implementation https://github.com/joonson/syncnet_python

**Expectations:**
- Given a video file (e.g., MP4), detect if there are any AV sync issues
- Return the time offset between the audio and video streams
- Explore and potentially implement models like SyncNet or Wav2Lip

---

## 8. HLS VOD Clip Replay Application

**Description:** Given an HLS VOD URL and time intervals (up to 16 intervals of minimum 5 seconds each), create a React application to replay the clips corresponding to the time intervals in a seamless continuous manner. 

**Expectations:**
- A web application using HLS.js or another HLS player
- Accept an HLS VOD URL and up to 16 time intervals (each minimum 5 seconds)
- Replay the clips corresponding to the time intervals in a seamless continuous manner
- Ensure smooth transitions between clips
