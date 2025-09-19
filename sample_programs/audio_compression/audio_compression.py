# MDCT + Subbanding + Simple Psychoacoustic Analysis Demo
#
# This notebook-style script:
# 1) Synthesizes a test audio signal.
# 2) Runs an MDCT analysis (sine window, 50% overlap).
# 3) Groups MDCT bins into Bark-scale subbands.
# 4) Estimates a simple psychoacoustic masking threshold (ATH + spreading).
# 5) Allocates coarse quantization per band to keep quantization noise under the threshold.
# 6) Reconstructs audio via IMDCT and evaluates quality.
# 7) Plots and saves WAV files for listening outside this environment.
#
# Notes:
# - This is an educational, simplified illustration inspired by MPEG-style approaches.
# - It is *not* a bitstream-compliant encoder.
# - Dependencies: numpy, scipy, matplotlib.

import sys
import numpy as np
import matplotlib.pyplot as plt
from scipy.io import wavfile
from math import pi

# --------------------------
# Utility: MDCT / IMDCT
# --------------------------

def sine_window(N):
    n = np.arange(N)
    return np.sin(pi/N * (n + 0.5))

def mdct(x, N):
    """
    MDCT with sine window, 50% overlap.
    Returns array of shape (num_frames, N//2).
    """
    w = sine_window(N)
    hop = N // 2
    # pad for full frames
    pad = (N - (len(x) % hop)) % hop
    x = np.concatenate([np.zeros(hop), x, np.zeros(hop + pad)])
    frames = []
    
    # Calculate n₀ = (N/2 + 1)/2 as per the reference image
    n0 = (N/2 + 1) / 2
    
    for i in range(0, len(x) - N + 1, hop):
        xw = x[i:i+N] * w
        # MDCT transform matrix as per reference image
        n = np.arange(N)
        k = np.arange(N//2)[:, None]
        # MDCT formula: cos(2π/N * (n + n₀) * (k + 1/2))
        C = np.cos((2*pi/N) * (n + n0) * (k + 0.5))
        X = np.dot(C, xw)
        frames.append(X)
    return np.array(frames), hop

def imdct(X, N):
    """
    IMDCT with sine window, 50% overlap-add.
    Reconstructs time-domain signal.
    """
    w = sine_window(N)
    hop = N // 2
    num_frames = X.shape[0]
    out_len = num_frames * hop + hop + hop  # matches mdct padding
    y = np.zeros(out_len)
    
    # Calculate n₀ = (N/2 + 1)/2 as per the reference image
    n0 = (N/2 + 1) / 2
    
    n = np.arange(N)
    k = np.arange(N//2)[:, None]
    # IMDCT formula as per reference image: cos(2π/N * (n + n₀) * (k + 1/2))
    C = np.cos((2*pi/N) * (n + n0) * (k + 0.5))
    for i in range(num_frames):
        xw = np.dot(C.T, X[i])  # inverse transform
        # Scale by 4/N as per reference image
        xw = (4.0/N) * xw
        # Apply synthesis window for overlap-add reconstruction
        xw = xw * w
        start = i * hop
        y[start:start+N] += xw
    # Remove the analysis pre/post padding used in mdct()
    return y[hop:-hop]

# --------------------------
# Bark scale helpers
# --------------------------

def hz_to_bark(freq_hz):
    # Traunmüller approximation (1990)
    return 26.81 / (1 + 1960.0 / freq_hz) - 0.53

def bark_band_edges(fs, N):
    """Return center frequency and band index per MDCT bin (0..N/2-1)."""
    # MDCT bins correspond to frequencies centered at (k+0.5)*fs/(2N)
    k = np.arange(N//2)
    freqs = (k + 0.5) * fs / (2*N)
    bark = hz_to_bark(np.maximum(freqs, 1.0))  # avoid div by zero
    # Use integer Bark bands 0..~24 (24 Bark ~ Nyquist around 24 kHz)
    band_idx = np.clip(np.floor(bark).astype(int), 0, 24)
    band_centers = np.array([np.mean(freqs[band_idx == b]) if np.any(band_idx==b) else 0 for b in range(25)])
    return freqs, bark, band_idx, band_centers

# --------------------------
# Psychoacoustic model (very simplified)
# --------------------------

def absolute_threshold_of_hearing(freq_hz):
    """Approximate ATH (dB SPL-like) as a function of frequency (Hz)."""
    f = np.maximum(freq_hz, 1.0) / 1000.0
    # Zwicker-like curve (rough)
    ath = 3.64*(f**-0.8) - 6.5*np.exp(-0.6*(f-3.3)**2) + 1e-3*(f**4)
    # Return in dB; scale to something we can compare with per-band energy dB
    return ath

def spreading_function_db(delta_bark):
    """
    Simple asymmetric spreading function in dB per Bark distance.
    Negative delta: below the masker; Positive delta: above the masker.
    """
    down = -24  # dB/Bark downward
    up = -27    # dB/Bark upward
    return np.where(delta_bark < 0, down * (-delta_bark), up * (delta_bark))

def estimate_masking_threshold_db(band_energies_db, band_centers_hz):
    """
    Combine ATH and masker spreading to estimate threshold per Bark band (in dB).
    band_energies_db: shape (num_frames, num_bands)
    band_centers_hz: shape (num_bands,)
    """
    num_frames, num_bands = band_energies_db.shape
    # Bark positions of band centers
    bark_pos = hz_to_bark(np.maximum(band_centers_hz, 1.0))
    bark_pos[np.isnan(bark_pos)] = 0.0

    # Precompute spreading matrix in dB between bands
    delta = bark_pos[None, :] - bark_pos[:, None]  # (num_bands, num_bands): from i->j
    spread_db = spreading_function_db(delta)

    # Apply spreading: for each frame, compute maskers' influence
    thresholds_db = np.empty_like(band_energies_db)
    ath_db = absolute_threshold_of_hearing(np.maximum(band_centers_hz, 1.0))
    ath_db = np.where(np.isfinite(ath_db), ath_db, np.max(ath_db[np.isfinite(ath_db)]))

    for t in range(num_frames):
        # Broadcast add: each masker energy + spreading to all bands
        influence = band_energies_db[t][:, None] + spread_db  # (num_bands, num_bands)
        # Energy-domain sum of maskers (convert dB to linear power, sum, back to dB)
        inf_lin = 10**(influence/10.0)
        summed = np.sum(inf_lin, axis=0) + 1e-12
        thresh_maskers_db = 10*np.log10(summed)
        # Combine with ATH (take max in power domain)
        ath_lin = 10**(ath_db/10.0)
        max_lin = np.maximum(summed, ath_lin)
        thresholds_db[t] = 10*np.log10(max_lin + 1e-12)

    return thresholds_db

# --------------------------
# Bit allocation & Quantization (toy example)
# --------------------------

def quantize_mdct_per_band(X_frames, band_idx, thresholds_db, safety_db=6.0):
    """
    Scalar quantization per band:
    - For each band, set quantization step so quantization noise power <= masking threshold.
    - Apply uniform quantization to MDCT coeffs in that band for each frame.
    Returns dequantized MDCT frames.
    """
    N2 = X_frames.shape[1]
    num_frames = X_frames.shape[0]
    nbands = thresholds_db.shape[1]
    Xq = np.zeros_like(X_frames)

    # Precompute band masks
    band_masks = [np.where(band_idx == b)[0] for b in range(nbands)]
    print("band_masks=", band_masks)

    for t in range(num_frames):
        for b in range(nbands):
            bins = band_masks[b]
            if len(bins) == 0:
                continue
            coeffs = X_frames[t, bins]
            
            # Calculate total signal power in this band (linear scale)
            sig_pow_total = np.sum(coeffs**2) + 1e-20
            sig_pow_db = 10*np.log10(sig_pow_total)
            
            # Masking threshold power (convert from dB to linear)
            mask_thresh_db = thresholds_db[t, b]
            mask_thresh_pow = 10**(mask_thresh_db/10.0)
            
            # Target quantization noise power (with safety margin)
            # Noise should be below masking threshold
            target_noise_pow = mask_thresh_pow / (10**(safety_db/10.0))
            
            # For uniform quantization: noise_variance = q²/12
            # Total quantization noise power in band = noise_variance * num_bins
            num_bins = len(bins)
            noise_var_per_bin = target_noise_pow / num_bins
            q = np.sqrt(12.0 * noise_var_per_bin)
            
            # Ensure reasonable quantization step
            if not np.isfinite(q) or q <= 0:
                q = 1e-6
            
            # Prevent over-quantization that would destroy the signal
            max_coeff = np.max(np.abs(coeffs))
            if max_coeff > 0 and q > max_coeff / 2.0:
                q = max_coeff / 2.0
            
            # Quantize
            Xi = np.round(coeffs / q)
            Xq[t, bins] = Xi * q
            
    return Xq

# --------------------------
# Synthesize test signal
# --------------------------

fs = 48000
dur = 2.0  # seconds
t = np.arange(int(fs*dur)) / fs

# Three tones + pink-ish noise
sig = (
    0.5*np.sin(2*pi*440*t) +           # A4
    0.3*np.sin(2*pi*1000*t) +          # 1 kHz
    0.2*np.sin(2*pi*3500*t)            # 3.5 kHz
)

# Pink-ish noise via 1/f filter in freq domain
rng = np.random.default_rng(0)
white = rng.standard_normal(sig.shape[0])
# simple pinking via FFT magnitude shaping
F = np.fft.rfft(white)
freqs = np.fft.rfftfreq(len(white), 1/fs)
shape = 1/np.maximum(freqs, 1.0)  # 1/f
pink = np.fft.irfft(F * shape / np.max(shape))
pink = pink / np.max(np.abs(pink)) * 0.1

x = sig + pink
x = x / np.max(np.abs(x)) * 0.9

# --------------------------
# MDCT Analysis
# --------------------------

N = 1024  # MDCT window size
X_frames, hop = mdct(x, N)            # (T, N/2)
T_frames = X_frames.shape[0]
N2 = X_frames.shape[1]
print(X_frames.shape)

# --------------------------
# Subbanding on Bark scale
# --------------------------

freqs, bark, band_idx, band_centers = hz_to_bark(np.linspace(1, fs/2, N2)), None, None, None
# Recompute using helper (maps MDCT bin centers)
freqs, bark, band_idx, band_centers = hz_to_bark((np.arange(N2)+0.5)*fs/(2*N)), None, None, None

# Oops, fix: use dedicated function for clarity
freqs, bark_vals, band_idx, band_centers = hz_to_bark((np.arange(N2)+0.5)*fs/(2*N)), None, None, None
# Actually call the proper function:
freqs, bark_vals, band_idx, band_centers = (lambda fs, N: (
    (np.arange(N//2)+0.5) * fs / (2*N),
    hz_to_bark(np.maximum(((np.arange(N//2)+0.5) * fs / (2*N)), 1.0)),
    np.clip(np.floor(hz_to_bark(np.maximum(((np.arange(N//2)+0.5) * fs / (2*N)), 1.0))).astype(int), 0, 24),
    np.array([np.mean(((np.arange(N//2)+0.5) * fs / (2*N))[np.clip(np.floor(hz_to_bark(np.maximum(((np.arange(N//2)+0.5) * fs / (2*N)), 1.0))).astype(int), 0, 24) == b]) if np.any(np.clip(np.floor(hz_to_bark(np.maximum(((np.arange(N//2)+0.5) * fs / (2*N)), 1.0))).astype(int), 0, 24)==b) else 0 for b in range(25)])
))(fs, N)

print(band_idx)
nbands = 25
# Energy per band per frame
band_energy = np.zeros((T_frames, nbands))
for b in range(nbands):
    bins = np.where(band_idx == b)[0]
    if len(bins) == 0:
        continue
    band_energy[:, b] = np.mean(X_frames[:, bins]**2, axis=1) + 1e-20

band_energy_db = 10*np.log10(band_energy)
print(band_energy_db.shape)

# --------------------------
# Psychoacoustic Thresholds
# --------------------------

thresholds_db = estimate_masking_threshold_db(band_energy_db, band_centers)
print("threshold_shape=", thresholds_db.shape)

# --------------------------
# Quantization per band and Reconstruction
# --------------------------

print("band_idx.shape=", band_idx.shape, "thresholds_db.shape=", thresholds_db.shape)
Xq_frames = quantize_mdct_per_band(X_frames, band_idx, thresholds_db, safety_db=6.0)
print("Xq_frames.shape=", Xq_frames.shape, X_frames.shape)
y = imdct(Xq_frames, N)

# Normalize outputs for saving using the same scale factor
max_val = np.max(np.abs(x)) + 1e-12
x_out = (x / max_val * 0.95).astype(np.float32)
y_out = (y / max_val * 0.95).astype(np.float32)

wavfile.write("/tmp/original.wav", fs, x_out)
wavfile.write("/tmp/reconstructed.wav", fs, y_out)

# --------------------------
# Metrics
# --------------------------

min_len = min(len(x_out), len(y_out))
mse = np.mean((x_out[:min_len] - y_out[:min_len])**2)
snr = 10*np.log10(np.sum(x_out[:min_len]**2) / (np.sum((x_out[:min_len]-y_out[:min_len])**2) + 1e-12))

# --------------------------
# Plots (1 figure per chart; no specified colors)
# --------------------------

# Waveform comparison (first 50 ms)
plt.figure()
seg = int(0.05 * fs)
plt.plot(x_out[:seg], label="Original")
plt.plot(y_out[:seg], label="Reconstructed", alpha=0.7)
plt.title("Waveform (first 50 ms)")
plt.xlabel("Samples")
plt.ylabel("Amplitude")
plt.legend()
plt.show()

# Average band energy vs threshold (dB)
plt.figure()
avg_band_db = np.mean(band_energy_db, axis=0)
avg_thresh_db = np.mean(thresholds_db, axis=0)
plt.plot(np.arange(nbands), avg_band_db, label="Avg Band Energy (dB)")
plt.plot(np.arange(nbands), avg_thresh_db, label="Avg Masking Threshold (dB)")
plt.title("Bark-band Energy vs. Masking Threshold")
plt.xlabel("Bark band index")
plt.ylabel("dB (relative)")
plt.legend()
plt.show()

# MDCT magnitude spectrum (single frame) before/after quantization
frame_idx = T_frames//2
plt.figure()
plt.plot(np.abs(X_frames[frame_idx]) + 1e-12, label="MDCT |X| (frame mid)")
plt.plot(np.abs(Xq_frames[frame_idx]) + 1e-12, label="Quantized |X| (frame mid)")
plt.title("MDCT Magnitude (single frame)")
plt.xlabel("MDCT bin")
plt.ylabel("Amplitude")
plt.yscale("log")
plt.legend()
plt.show()

print(f"MSE: {mse:.6f}, SNR: {snr:.2f} dB")
print("Saved files:")
print(" - /mnt/data/original.wav")
print(" - /mnt/data/reconstructed.wav")
