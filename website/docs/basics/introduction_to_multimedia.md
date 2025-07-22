---
sidebar_position: 1
title: Introduction
---

Multimedia is a term that refers to the combination of different media types, such as text, audio, and video, into a single presentation. It is a broad term that encompasses a wide range of technologies and applications.

Multimedia is used in a variety of contexts, including:

- Entertainment: Multimedia is used in movies, television shows, and other forms of entertainment.
- Education: Multimedia is used in schools and universities to create interactive learning experiences.
- Business: Multimedia is used in marketing and advertising to create engaging and informative presentations.

## Digital Video and Audio

All modern video and audio processing is done in digital domain. A video processing signal chain is about color space conversions along the way. These conversions have to be done at the pixel rate, for example, consider HD resolution which is 1920 × 1080 with 60 fps (frames per second). i.e. 1920 × 1080 × 60 pixels are coming in each second, which means 124.4 million pixels in each second.  Any operation that needs to be done on the bits of one pixel must be done so fast that the same operation can be done on 124.4 million pixels in the space of one second. In other words the frequency is 124.4 Mhz. In reality this is around 148 Mhz since we must account for the timing information in each video frame. A color plane refers to the bits associated with each color R, G or B, for example. Let’s say 8 bits for each color plane and let’s assume simple RGB color planes. Going back to the processing speed, each pixel’s 24 bits have to be manipulated at a frequency of 148 Mhz. If you use an 8-bit DSP, which can manipulate 8 bits, then you have to run this DSP at 3 × 148 Mhz to keep up with the pixels coming in. In practice HD video manipulation would normally be done on a 32-bit DSP or processor. This topic looks into the signal processing of video and audio that form part of a video signal. 

### Video

Key Concepts:

- **FPS**: Frames per second. Typically 24, 25, 30, 60, 29.97 and 59.94.
- **Resolution**: Width and height of the video. Typical resolutions are as follows:
  - 1080p: 1920x1080 a.k.a. Full HD
  - 720p: 1280x720 a.k.a. HD
  - 480p: 640x480 a.k.a. SD
  - 360p: 480x360 a.k.a. SD
  - 240p: 320x240
  - 144p: 176x144
- **Bitrate**: The amount of data used to represent the video.

Images are played on screen at FPS that gives the illusion of motion.

Checkout [FLipbook](https://www.youtube.com/watch?v=hio2CGVLihY)

Representation in python: Numpy array of shape (n, width, height, 3) where n is the number of frames stacked. Each number in the array is a 
uint8 with values between 0 and 255.

### Audio

Key Concepts:

- **Sampling Rate**: Number of audio samples per second. Typically 44100, 48000, 96000, 192000.
- **Bitrate**: The amount of data used to represent the audio.
- **Bits per sample**: The number of bits used to represent each sample. Typically 16, 24, 32.
- **Channels**: The number of audio channels. Typically 1 for mono and 2 for stereo. 6 for 5.1 surround sound.

Representation in python: Numpy array of shape (n, 2) where n is the number of samples. Each number in the array is a float32 with values between -1 and 1.


## Raw Bitrate

### Raw Video Bitrate

Raw Video bitrate = Width * Height * FPS * Bits per pixel

1 pixel is represented by 3 bytes (24 bits) for RGB.

For example, a 1080p video at 30 FPS with 8 bits per pixel has a raw bitrate of 1080 * 1920 * 30 * 24 = 1.5Gbps

### Raw Audio Bitrate

Raw Audio bitrate = Sampling Rate * Bits per sample * Channels

For example, a 48000 Hz audio at 16 bits per sample with 2 channels has a raw bitrate of 48000 * 16 * 2 = 1.536Mbps


## Physics of perception and human sensory evolution

Why 16 bits per sample for audio where as 8 bits per pixel for video?

### Human Hearing Sensitivity

    The human ear can detect an enormous range of volumes — from the quietest whisper to a jet engine.

    This range is roughly 96 dB in amplitude (from threshold of hearing to pain).

    16-bit audio can represent 65,536 distinct amplitude levels per sample.

    That gives about 96 dB of dynamic range, matching human hearing quite well.

#### Why We Need So Many Bits

    Audio amplitude is a linear signal, but we perceive loudness logarithmically (e.g., doubling the pressure doesn’t double the perceived loudness).

    To avoid perceptible quantization noise, especially in quiet passages (like classical music), we need 16 bits.

#### Evolutionary Angle

    Our auditory system evolved for:

        Detecting predators or prey in subtle sounds.

        Parsing complex patterns like speech in noisy environments.

    So we evolved extremely sensitive hearing, especially for dynamic range and temporal precision (down to microseconds).


### Human Visual Sensitivity

    Humans see light logarithmically, similar to hearing sound, but:

        We’re far less sensitive to small gradations in brightness or color compared to sound level changes.

        Most of our color discrimination occurs in mid-brightness ranges.

        We're also more sensitive to luminance (brightness) than to chrominance (color).

#### 8 Bits per Channel Is Usually Enough

    8 bits per color channel = 256 levels of red, green, blue

    That gives ~16.7 million colors (256³), which is enough to represent most color differences that humans can perceive on a screen.

    Modern TVs and cameras may use 10-bit or 12-bit color for HDR content, where smoother gradients and more detail in shadows/highlights are required.

#### Evolutionary Angle

    Vision evolved for detecting contrast, movement, and edges — not smooth gradations.

    Our eyes adapt quickly to lighting, and have fewer cones for color compared to the number of hair cells in the cochlea for sound.

    Most sensitive region (fovea) is a small part of the retina; peripheral vision has lower color and brightness resolution.


### Example videos

- https://www.youtube.com/watch?v=Q-KPrxjNojI 0-1000 Nits brightness


### Example python code to generate different dB tone

```python
import numpy as np
from scipy.io.wavfile import write
import os

# Parameters
sample_rate = 44100  # 44.1 kHz sample rate
duration = 1.0       # seconds
frequency = 1000     # 1 kHz tone

# Output directory
os.makedirs("sine_tones", exist_ok=True)

# Generate time axis
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# Reference amplitude for 0 dBFS
ref_amplitude = 0.999  # Max just under 1.0 to avoid clipping

# Generate tones from -90 dB to 0 dB
for db in range(-90, 1):  # Inclusive of 0 dB
    # Convert dB to linear amplitude scale
    amplitude = ref_amplitude * (10 ** (db / 20))
    waveform = amplitude * np.sin(2 * np.pi * frequency * t)

    # Convert to 16-bit PCM format
    waveform_int16 = np.int16(waveform * 32767)

    # Save to WAV file
    filename = f"sine_tones/sine_1kHz_{db}dB.wav"
    write(filename, sample_rate, waveform_int16)

print("Generated sine tones from -90 dB to 0 dB in ./sine_tones")

```


