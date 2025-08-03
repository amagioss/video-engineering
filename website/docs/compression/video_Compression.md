
# Compression

- Need for compression(brief recap)

## Compression as Predict → Residual → Encode

```mermaid
graph LR
    A["Original Data x"] --> B["Predictor: Predict(x) = x̂"]
    B --> C["Residual: r = x - x̂"]
    C --> D["Encoder: Encode(r)"]
```

## Information Theory

- [Motivation of entropy](https://www.youtube.com/watch?v=0GCGaw0QOhA&t=2s)


Shannon's theorem:

Shannon’s source coding theorem (verbal statement). N i.i.d. ran-
dom variables each with entropy H(X) can be compressed into more
than N H(X) bits with negligible risk of information loss, as N → ∞;
conversely if they are compressed into fewer than N H(X) bits it is vir-
tually certain that information will be lost.


## Video Compression

```bash
wget https://github.com/amagioss/video-engineering/raw/refs/heads/main/website/references/ian_richardson_compression.pptx
```

H264 Standard can be downloaded from [here](https://www.itu.int/rec/T-REC-H.264-202408-I).

References:

- https://github.com/leandromoreira/digital_video_introduction
- https://web.stanford.edu/class/ee398a/handouts/lectures/EE398a_MotionEstimation_2012.pdf
- https://www.youtube.com/watch?v=0GCGaw0QOhA&t=2s
- https://www.slideshare.net/slideshow/introduction-to-video-compression-13394338/13394338#38
- https://yuanz.web.illinois.edu/teaching/18.434sp16/SSCT-Vinay.pdf