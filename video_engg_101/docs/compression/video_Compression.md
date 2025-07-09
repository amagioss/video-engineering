
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

- Motivation of entropy: Youtube video


Shannon's theorem:

Shannon’s source coding theorem (verbal statement). N i.i.d. ran-
dom variables each with entropy H(X) can be compressed into more
than N H(X) bits with negligible risk of information loss, as N → ∞;
conversely if they are compressed into fewer than N H(X) bits it is vir-
tually certain that information will be lost.


References:

- https://www.youtube.com/watch?v=0GCGaw0QOhA&t=2s
- https://www.slideshare.net/slideshow/introduction-to-video-compression-13394338/13394338#38
- https://yuanz.web.illinois.edu/teaching/18.434sp16/SSCT-Vinay.pdf