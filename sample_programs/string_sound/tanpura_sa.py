import numpy as np
from scipy.io.wavfile import write
import matplotlib.pyplot as plt

# Parameters
sample_rate = 44100  # Samples per second
duration = 3.0       # Duration in seconds
frequency = 220.0    # Frequency of Sa (440Hz)

# Karplus-Strong algorithm
def karplus_strong(frequency, duration, sample_rate):
    N = int(sample_rate / frequency)
    # Initialize a white noise burst
    noise = np.random.uniform(-1, 1, N)
    samples = np.zeros(int(sample_rate * duration))
    samples[:N] = noise

    for i in range(N, len(samples)):
        samples[i] = 0.5 * (samples[i - N] + samples[i - N - 1])

    return samples

# Generate waveform
sound = karplus_strong(frequency, duration, sample_rate)

# Normalize to 16-bit PCM range
sound_int16 = np.int16(sound / np.max(np.abs(sound)) * 32767)

# Save as WAV file
write("sa_swara_tanpura.wav", sample_rate, sound_int16)

# Optional: Plot the waveform
plt.plot(sound[:1000])
plt.title("Karplus-Strong Plucked String Waveform (Sa Swara)")
plt.xlabel("Sample")
plt.ylabel("Amplitude")
plt.show()
