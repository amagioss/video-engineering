# NTSC and PAL Stories

**Credit**: This page is derived from chat gpt conversation.

## **NTSC: From 30 fps B\&W to 29.97 fps Color**

### Original NTSC Black-and-White (1941)

* **Frame rate**: 30 fps (exact)
* **525 lines/frame**
* Pure **luminance (Y)** signal (brightness only)
* Compatible across all TV sets

When color TV was introduced in the early 1950s, the U.S. wanted:

* **Backward compatibility**: Color broadcasts must work on old black-and-white TVs.
* **Single channel**: Fit color info into the same 6 MHz RF channel used for B\&W.
* **No extra bandwidth**

To achieve this, NTSC engineers used a clever trick:

>  Encode color (chrominance) as a **subcarrier** modulated and **added to the luminance** signal.

This meant combining:

* **Luminance (Y)** — what B\&W TVs display
* **Chrominance (C)** — two components (I and Q) modulated on a 3.579545 MHz subcarrier

---

## The Problem: Beat Frequencies (Interference)

The new **3.579545 MHz chroma subcarrier** had to be:

1. **High enough frequency** to preserve color detail
2. \*\*Low enough to fit within the 6 MHz signal bandwidth
3. **Interleaved** with the luminance signal’s spectral energy
4. Most importantly: **not interfere** with the **horizontal scan (line) rate harmonics**

### Here's where the trouble started:

* The **horizontal scan frequency** was:

  $$
  f_H = 30\, \text{fps} \times 525 = 15,750\, \text{Hz}
  $$
* Its harmonics (multiples) occupy the video spectrum.
* The **chroma subcarrier** would produce **beats** (interference) with these harmonics unless it was carefully chosen.

So the engineers chose a subcarrier frequency that was **$227.5 × f_H$**, which is:

$$
3.579545 \text{ MHz} = 227.5 \times 15,734.26\, \text{Hz}
$$

To make this math work **cleanly**, they had to **slightly reduce the horizontal scan rate**, and hence the **frame rate**, from exactly 30 to:

$$
29.97\, \text{fps}
$$

This avoided visible **moiré patterns** and **luma-chroma cross-talk**.

---

## Why PAL Didn’t Have This Problem

The **PAL system**, developed in Europe in the early 1960s, **learned from NTSC’s challenges** and had two big advantages:

### 1. Designed for Color from the Start

PAL was designed **after NTSC** and specifically for color. PAL did not need to retrofit compatibility into an existing black-and-white system with a fixed frame rate.

### 2. Different Frame Rate & Power Grid

* **PAL frame rate** is **25 fps**, not 30.
* It's based on the **50 Hz power line frequency** used in Europe.
* PAL line frequency: 625 lines × 25 fps = 15,625 Hz
* Subcarrier: 4.43361875 MHz = **283.75 × 15,625**

This clean multiple meant:

* No need to fudge the frame rate
* No harmful interference between chroma and luma
* Color information fits more smoothly in the signal spectrum

### 3. Better Color Error Handling

PAL alternates the phase of the color subcarrier every line to **cancel out phase errors**, unlike NTSC (which has to deal with color drift and requires a "tint" control on TVs).

---

## ️The Problem: Storing Digital Audio Using Analog Video Gear

In the late 1970s and early 1980s, **dedicated digital audio storage systems didn't exist yet**. So engineers used video tape recorders (like Sony's U-matic) and **converted audio data into black-and-white video waveforms** via **PCM adapters**. These adapters essentially mapped digital 1s and 0s into video scan lines and recorded them visually.

To make this work, the **audio sampling rate had to align with the video frame and line structure**.

---

## NTSC and PAL Video Systems – A Quick Refresher

| Format       | Frame Rate  | Lines/Frame | Fields/Frame   | Lines/Field |
| ------------ | ----------- | ----------- | -------------- | ----------- |
| NTSC (US)    | \~29.97 fps | 525         | 2 (interlaced) | 262.5       |
| PAL (Europe) | 25 fps      | 625         | 2              | 312.5       |

Each **frame** in these systems is made of two **interlaced fields**, and **each field contains multiple scan lines**.

---

## Mapping Audio Samples to Video Lines

Here's the key constraint:
The PCM adapter had to **fit a certain number of digital audio samples into each scan line**. So the sampling rate had to be carefully chosen so that:

* The **number of audio samples per video frame** was an **integer**.
* The **same sampling rate** could work on **both NTSC and PAL** without changing the equipment or system logic.

The designers chose to store:

* **1470 audio samples per frame for NTSC**, and
* **1764 samples per frame for PAL**.

Here's how it maps:

### NTSC Calculation

* Frame rate: 29.97 fps
* 1470 samples/frame × 29.97 fps ≈ **44,100 samples/sec**

### PAL Calculation

* Frame rate: 25 fps
* 1764 samples/frame × 25 fps = **44,100 samples/sec**

Thus, **both NTSC and PAL video formats could store exactly 44.1 kHz audio**, just with different numbers of samples per frame.

> **This allowed PCM audio to be recorded and played back on either NTSC or PAL equipment without changing the sampling rate**.

---

## Why Exactly 1470 or 1764 Samples per Frame?

Those specific numbers (1470 and 1764) were chosen because they:

* Fit cleanly into the **available number of usable video lines**.
* Allowed two-channel (stereo) audio data to be mapped evenly across the lines.
* Gave a good balance between fidelity and bandwidth (given tape limitations).

Each video line could store about **15 audio samples**, and not all 525 or 625 lines per frame were usable (some lines were reserved for sync signals and vertical blanking). After accounting for those, around **98 lines per field** were available for audio storage. Multiply that by **2 fields per frame** and **15 samples per line**, and you get around 1470–1764 samples.

---

## Why This Matters

This is a great example of **cross-domain engineering constraints**:

* Audio engineers had to **design within the limits of video equipment**.
* The **44.1 kHz rate wasn't ideal or round**—it was just what **worked reliably** within these physical and technical constraints.

Once the Compact Disc was developed, Sony and Philips locked in **44.1 kHz as the official CD sampling rate**—cementing this video-era workaround into digital audio history.

