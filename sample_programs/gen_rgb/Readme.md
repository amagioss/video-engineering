# RGB Video Generator

This program generates animated RGB video frames featuring a bouncing red square and streams them to ffplay for real-time playback.

## Prerequisites

### 1. Node.js
- **Version**: Node.js 16.x or later
- **Installation**: Download from [nodejs.org](https://nodejs.org/) or use a package manager
  ```bash
  # macOS (using Homebrew)
  brew install node
  
  # Ubuntu/Debian
  sudo apt update && sudo apt install nodejs npm
  
  # Windows
  # Download installer from nodejs.org
  ```

### 2. FFmpeg
- **Required**: `ffplay` command (part of FFmpeg suite)
- **Installation**:
  ```bash
  # macOS (using Homebrew)
  brew install ffmpeg
  
  # Ubuntu/Debian
  sudo apt update && sudo apt install ffmpeg
  
  # Windows
  # Download from https://ffmpeg.org/download.html
  # Add to PATH environment variable
  ```

### 3. Dependencies
Install the required Node.js packages:
```bash
npm install
```

## Setup and Run

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run the program**:
   ```bash
   npx tsx gen_rgb.ts
   ```

3. **Stop the program**: Press `Ctrl+C` to terminate

## What it does

- Generates 1280x720 RGB24 video frames at 30 FPS
- Displays a bouncing red square that changes direction when hitting screen edges
- Streams the video data directly to ffplay for real-time playback
- No files are saved to disk - everything is streamed in real-time

## Troubleshooting

- **"Failed to start ffplay"**: Make sure FFmpeg is installed and `ffplay` is in your PATH
- **"command not found: npx"**: Ensure Node.js is properly installed
- **TypeScript errors**: Run `npm install` to install all dependencies