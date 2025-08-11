# SRT streaming using ffmpeg

This page gives example of streaming a simple video file using Simple Reliable Transmission (SRT) protocol.

## Steps


1. Check if ffmpeg support srt

```bash
ffmpeg -protocols | grep -E "Input|srt|Output"

# Output should have

Input:
  srtp
  srt
Output:
  srtp
  srt
```

---

2. Sender (listener) – stream MP4 over SRT**

```bash
ffmpeg -re -i input.mp4 -c copy -f mpegts "srt://0.0.0.0:9000?mode=listener&latency=120&pkt_size=1316"
```

* Now the sender is bound to port `9000` and waits for incoming SRT connections.

---

3. Receiver (caller) – receive and pipe to ffplay**

```bash
# ffmpeg -i "srt://SENDER_IP:9000?mode=caller" -f mpegts - | ffplay -

ffmpeg -i "srt://127.0.0.1:9000?mode=caller" -f mpegts - | ffplay -
```

* The receiver initiates the connection to the sender’s IP.

---


## Notes

- `mode=listener` – Tells FFmpeg to wait for an incoming SRT connection instead of initiating one. In `caller` mode, FFmpeg initiates the connection to the sender’s IP.

- `latency=120` – Sets the SRT receiver-side latency buffer to 120 ms. This helps smooth out jitter and packet loss; higher values increase delay but improve stability on poor networks.

- `pkt_size=1316` – Sets the SRT packet size in bytes. 1316 B is optimal for MPEG-TS over SRT because it fits 7 MPEG-TS packets (7 × 188 B) without fragmentation.