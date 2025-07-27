# Some useful ffmpeg commands

### Dump 5 rgb frames at an offset on n seconds

```bash
ffmpeg -ss 73  -i tears_of_steel_720p.mov -frames:v 5 -f image2pipe -pix_fmt rgb24 -vcodec rawvideo output.rgb
```

---

### Dump default video frames which are YUV 4:2:0

```bash
ffmpeg -ss 73  -i tears_of_steel_720p.mov -frames:v 5 -vcodec rawvideo output.yuv
```

---

### Generate sine tone audio wav file

```bash
ffmpeg -f lavfi -i "sine=frequency=440:duration=5" -c:a pcm_s16le -ar 44100 -ac 1 output.wav
```

---

# Ffplay Commands

### Play a rgb file in a loop

You could change the frame to 1fps.

```bash
ffplay -loop 0 -f rawvideo -pixel_format rgb24 -video_size 1280x534 -framerate 30 output.rgb
```

---

### Play yuv file in a loop

```bash
ffplay -loop 0 -f rawvideo -pixel_format yuv420p -video_size 1280x534 -framerate 30 output.yuv
```

---

### Synthetic video generation

```bash
ffplay -f lavfi -i testsrc2=duration=10:size=1280x720:rate=30
```