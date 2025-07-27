
# HTML5 to Video Converter

A Node.js TypeScript application that converts HTML5 files to ARGB MOV video format using Playwright for browser automation and FFmpeg for video encoding.

## Features

- Convert any HTML5 file to ARGB MOV format
- Support for animations, CSS transitions, and dynamic content
- Configurable video dimensions, duration, and frame rate
- Command-line interface with multiple options
- Uses Playwright for reliable browser automation
- Produces high-quality ProRes 4444 videos with alpha channel support

## Prerequisites

Before running this application, ensure you have the following installed:

1. **Node.js** (version 16 or higher)
2. **FFmpeg** with ProRes support
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install ffmpeg
   
   # macOS (using Homebrew)
   brew install ffmpeg
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage

Convert an HTML file to video using a sample ticker html. Video will be saved in 
the `samples` folder.
```bash
npm start -- samples/ticker-transparent.html -d 20 -f 30
```

### Overlay the generated video with a background video 


```bash
ffmpeg \         
  -stream_loop -1 -i ./samples/ticker-transparent.mov \
  -i /home/sbanger/sb/media/open_videos/big_buck_bunny_720p_h264.mov \
  -filter_complex "[0:v]format=yuva444p12le[overlay]; [1:v][overlay]overlay=format=auto:shortest=1[outv]" \
  -map "[outv]" -map 1:a \
  -c:v libx264 -pix_fmt yuv420p \
  -c:a copy \
  -shortest \
  output.mp4
```


### Command Line Options

- `<input>`: Input HTML file path (required)
- `-o, --output <path>`: Output video file path (optional, defaults to input filename with .mov extension)
- `-w, --width <number>`: Video width in pixels (default: 1920)
- `-h, --height <number>`: Video height in pixels (default: 1080)  
- `-d, --duration <number>`: Recording duration in seconds (default: 10)
- `-f, --fps <number>`: Frames per second (default: 30)

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Ensure FFmpeg is installed and available in your system PATH
2. **Playwright browser issues**: Run `npm run install-browsers` to install browser dependencies
3. **Permission errors**: Ensure you have write permissions in the output directory
4. **Memory issues**: For large videos, consider reducing resolution or duration

## License

MIT License 