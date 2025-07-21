---
title: Assignments
---


1. RGB pattern generation: Write a small code in python, c, c++ or javascript/typescript to 
generate a 1280x720 VIBGYOR pattern.

2. Video to raw rgb, yuv 4:2:0 dump, see the size and ensure expected size matches.

3. Play the dumped RGB file at different framerates.

4. Write a small python code to generate a sine wave of 440 Hz and play it.

## FAQs

1. How do I play a RGB file?

```bash
ffplay -f rawvideo -pixel_format rgb24 -video_size 1280x720 -framerate 30 video.rgb
```
