# FFmpeg Commands

1. Visualize motion vectors in a given video.

```bash
ffmpeg -flags2 +export_mvs -i /files/v/small_bunny_1080p_30fps.mp4 -vf codecview=mv=pf+bf+bb /tmp/small_bunny_1080p_30fps_vis_mv.mp4
```

2. Try out examples from https://github.com/leandromoreira/digital_video_introduction/blob/master/encoding_pratical_examples.md
