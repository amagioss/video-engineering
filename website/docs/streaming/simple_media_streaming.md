# Minimal media streaming example

In this page we give steps to create a simple streaming server. 

Here's a tiny end-to-end setup you can try. It takes an MP4, makes multi-resolution HLS, serves it with Python, and plays it in a simple web page via hls.js.

# 1) Convert an MP4 into multi-resolution HLS (with a master playlist)

```bash
# 1080p, 720p, 480p, 360p ladders → master playlist = main.m3u8
mkdir -p streaming/hls_out

cd streaming

ffmpeg -y -i input.mp4 \
  -filter_complex "\
    [0:v]split=3[v720][v480][v360]; \
    [v720] scale=w=1280:h=720[v720o];  \
    [v480] scale=w=854:h=480[v480o]; \
    [v360] scale=w=640:h=360[v360o]" \
  -map "[v720o]"  -map 0:a -c:v:0 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k -r:v:1 30 -profile:v:1 main -c:a:1 aac -b:a:1 128k \
  -map "[v480o]"  -map 0:a -c:v:1 libx264 -b:v:2 1400k -maxrate:v:2 1498k -bufsize:v:2 2100k -r:v:2 30 -profile:v:2 main -c:a:2 aac -b:a:2 96k  \
  -map "[v360o]"  -map 0:a -c:v:2 libx264 -b:v:3 800k  -maxrate:v:3 856k  -bufsize:v:3 1200k -r:v:3 30 -profile:v:3 baseline -c:a:3 aac -b:a:3 64k \
  -pix_fmt yuv420p -preset veryfast \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "hls_out/%v/seg_%d.ts" \
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \
  -master_pl_name main.m3u8 \
  "hls_out/%v/stream.m3u8"
```

What you'll get:

```
hls_out/
  ├─ `0/stream.m3u8` (720p)
  ├─ `1/stream.m3u8` (480p)
  ├─ `2/stream.m3u8` (360p)
  └─ `main.m3u8` (master that references all variants)

```


# 2) Serve the HLS with a simple Python HTTP server

From the folder that **contains** `hls_out/main.m3u8` (i.e., `hls_out` itself):

```bash
cd hls_out
python3 -m http.server 8000
```

Now `http://localhost:8000/main.m3u8` is reachable.
Tip: if you host the HTML below elsewhere, keep it same-origin or enable CORS.

# 3) Interactive HTML page with hls.js

Save this as `player.html` (you can put it next to `hls_out` or inside it; adjust the `src` path accordingly). If you put it **inside** `hls_out`, you can open it directly at `http://localhost:8000/player.html`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Simple HLS Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    video { width: 100%; max-width: 900px; height: auto; background: #000; margin-top: 1rem; }
    .input-container { margin-bottom: 1rem; }
    input[type="url"] { width: 70%; padding: 8px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 8px 16px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #005999; }
    .status { margin-top: 10px; padding: 8px; border-radius: 4px; }
    .error { background-color: #fee; color: #c33; border: 1px solid #fcc; }
    .success { background-color: #efe; color: #363; border: 1px solid #cfc; }
  </style>
</head>
<body>
  <h1>HLS Demo Player</h1>
  
  <div class="input-container">
    <input type="url" id="urlInput" placeholder="Enter HLS stream URL (e.g., main.m3u8 or http://localhost:8000/main.m3u8)" value="main.m3u8" />
    <button onclick="loadVideo()">Load Video</button>
  </div>
  
  <div id="status"></div>
  <video id="video" controls muted playsinline></video>

  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script>
    const video = document.getElementById('video');
    const urlInput = document.getElementById('urlInput');
    const statusDiv = document.getElementById('status');
    let hls = null;

    function showStatus(message, isError = false) {
      statusDiv.innerHTML = message;
      statusDiv.className = `status ${isError ? 'error' : 'success'}`;
      if (!isError) {
        setTimeout(() => {
          statusDiv.innerHTML = '';
          statusDiv.className = '';
        }, 5000);
      }
    }

    function loadVideo() {
      const src = urlInput.value.trim();
      if (!src) {
        showStatus('Please enter a valid URL', true);
        return;
      }

      showStatus('Loading video...');
      console.log('Attempting to load:', src);

      // Clean up previous HLS instance
      if (hls) {
        hls.destroy();
        hls = null;
      }

      // Reset video
      video.src = '';
      video.load();

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari (iOS/macOS) plays HLS natively
        console.log('Using native HLS support');
        video.src = src;
        
        video.addEventListener('loadstart', () => showStatus('Loading manifest...'));
        video.addEventListener('loadedmetadata', () => showStatus('Metadata loaded, ready to play'));
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
          showStatus(`Video Error: ${video.error ? video.error.message : 'Unknown error'}`, true);
        });
        
      } else if (window.Hls && Hls.isSupported()) {
        console.log('Using hls.js');
        
        // Configure HLS with better settings
        const config = {
          debug: true,
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        };
        
        hls = new Hls(config);
        
        hls.on(Hls.Events.MEDIA_ATTACHING, () => {
          console.log('Media attaching...');
        });
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('Media attached, loading source...');
          showStatus('Media attached, loading manifest...');
        });
        
        hls.on(Hls.Events.MANIFEST_LOADING, () => {
          console.log('Manifest loading...');
          showStatus('Loading HLS manifest...');
        });
        
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('Manifest parsed:', data);
          showStatus(`HLS manifest loaded successfully. ${data.levels.length} quality levels found.`);
          
          // Try to play the video
          video.play().then(() => {
            showStatus('Video playing successfully!');
          }).catch(e => {
            console.log('Autoplay prevented or failed:', e);
            showStatus('Video loaded. Click play button to start.');
          });
        });
        
        hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          console.log('Level loaded:', data);
        });
        
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log('Fragment loaded:', data.frag.url);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('[hls.js error]', data);
          
          let errorMsg = 'HLS Error: ';
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            errorMsg += `Network error - ${data.details}. Check if the URL is correct and the server is running.`;
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            errorMsg += `Media error - ${data.details}`;
          } else {
            errorMsg += data.details || 'Unknown error';
          }
          
          showStatus(errorMsg, true);
          
          // Try to recover from some errors
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Trying to recover from network error...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Trying to recover from media error...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Cannot recover from this error');
                break;
            }
          }
        });
        
        // Attach media first, then load source
        hls.attachMedia(video);
        hls.loadSource(src);
        
      } else {
        showStatus('HLS is not supported in this browser', true);
      }
    }

    // Don't auto-load on page load, wait for user action
    // window.addEventListener('load', loadVideo);

    // Allow Enter key to load video
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loadVideo();
      }
    });

    // Add some debugging info
    console.log('HLS.js version:', window.Hls ? Hls.version : 'Not loaded');
    console.log('Native HLS support:', video.canPlayType('application/vnd.apple.mpegurl'));
  </script>
</body>
</html>
```

that's it:

1. run the `ffmpeg` command,
2. `cd hls_out && python3 -m http.server 8000`,
3. Copy the html section into a file called `play.html` and save it in the same directory as `hls_out`.
4. open `http://localhost:8000/player.html`, enter a URL, and press "Load Video". 🎬

(If you hit MIME type issues for `.m3u8`/`.ts` on some systems, serve with a real web server like nginx, or add MIME mappings. But `http.server` usually works fine for quick local tests.)
