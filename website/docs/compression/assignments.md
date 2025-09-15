---
title: Assignments
---

1. Try compressing a image buffer using own algorithm. It can be lossy or lossless.
E.g. Try the code [here](./vq_compression.py), by what factor is the image compressed?
How do I compare against the original image and output of png and jpeg? 

2. Calculate entropy of a gray image buffer. 

3. Study notebook defined [here](https://github.com/amagioss/video-engineering/blob/main/sample_programs/jpeg_enc_dec/jpeg_compression_demo.ipynb). It demonstrates basic principles of JPEG compression.

4. Given 2 consecutive frames of a video, find the best neighboring block in reference, subtract and reconstruct.

5. Compress a tone or drone sound generated in previous assignment using aac and mp3. 

6. Explore https://github.com/swesterfeld/audiowmark

7. Visualize motion vectors in a given video.

```bash
ffmpeg -flags2 +export_mvs -i /files/v/small_bunny_1080p_30fps.mp4 -vf codecview=mv=pf+bf+bb /tmp/small_bunny_1080p_30fps_vis_mv.mp4
```

8. Try out examples from https://github.com/leandromoreira/digital_video_introduction/blob/master/encoding_pratical_examples.md

