# Audio Compression

## Audio Consumption Evolution

```mermaid
%% Vertical timeline using a graph instead
graph TD
    A1["1920: First commercial radio station (KDKA)"] --> A2
    A2["1940s: Reel-to-reel magnetic tape introduced"] --> A3
    A3["1963: Philips releases compact cassette"] --> A4
    A4["1979: Sony Walkman launches portable music era"] --> A5
    A5["1982: Compact Disc (CD) brings digital audio"] --> A6
    A6["1993: MP3 standard finalized (MPEG-1 Layer III)"] --> A7
    A7["1999: Napster triggers digital file sharing boom"] --> A8
    A8["2001: Apple iPod + iTunes reshape music consumption"] --> A9
    A9["2008: Spotify launches streaming model"] --> A10
    A10["2010s: AAC, Opus, adaptive streaming codecs dominate"] --> A11
    A11["2020s: Personalized audio, Dolby Atmos, spatial sound"]

    style A1 fill:#fff8e1,stroke:#ffb300,stroke-width:2px
    style A11 fill:#e8f5e9,stroke:#43a047,stroke-width:2px
```

**Lossy Compression Techniques**: MP3, AAC

**Lossless Compression Techniques**: FLAC


## AAC Compression Explanation


```mermaid
flowchart TD

  %% Encoder Block
  subgraph Encoder
    A1[Audio In] --> B1[Analysis Filterbank]
    B1 --> C1[Quantization & Coding]
    C1 --> D1[Encoding of Bitstream]
    D1 --> E1[Bitstream Out]
    B1 --> F1[Perceptual Model]
    F1 --> C1
  end

  %% Decoder Block
  subgraph Decoder
    E2[Bitstream In] --> B2[Decoding of Bitstream]
    B2 --> C2[Inverse Quantization]
    C2 --> D2[Synthesis Filterbank]
    D2 --> E2_out[Audio Out]
  end

```



- **Filter bank**:
A filter bank is used to decompose the input
signal into subsampled spectral components
(time/frequency domain). Together with the corresponding
filter bank in the decoder it forms an
analysis/synthesis system.

- **Perceptual model**:
Using either the time domain input signal and/or
the output of the analysis filter bank, an estimate of
the actual (time and frequency dependent)masking
threshold is computed using rules known from psychoacoustics.
This is called the perceptual model
of the perceptual encoding system.

- **Quantization and coding**:
The spectral components are quantized and coded
with the aim of keeping the noise, which is introduced
by quantizing, below the masking threshold.
Depending on the algorithm, this step is done in
very different ways, from simple block companding
to analysis-by-synthesis systems using additional
noiseless compression.

- **Encoding of bitstream**:
A bitstream formatter is used to assemble the bitstream,
which typically consists of the quantized
and coded spectral coefficients and some side information,
e.g. bit allocation information.



# References

1. https://www.ee.columbia.edu/~dpwe/papers/Brand99-mp3.pdf
