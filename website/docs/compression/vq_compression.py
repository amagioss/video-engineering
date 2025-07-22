import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import struct

# --------------------
# Compression Function
# --------------------
def compress_image_vq(input_path, output_path, num_colors=64):
    # Load image and convert to RGB
    image = Image.open(input_path).convert('RGB')
    pixels = np.array(image).reshape(-1, 3)

    # Vector Quantization using K-Means
    kmeans = KMeans(n_clusters=num_colors, n_init='auto')
    labels = kmeans.fit_predict(pixels)
    palette = kmeans.cluster_centers_.astype(np.uint8)

    # Save to custom binary format: [width, height, num_colors, palette, labels]
    height, width = image.size[1], image.size[0]
    with open(output_path, 'wb') as f:
        f.write(struct.pack('>IIH', width, height, num_colors))
        f.write(palette.tobytes())
        f.write(bytearray(labels))

    print(f"Compressed {input_path} -> {output_path} using {num_colors} colors")

# ----------------------
# Decompression Function
# ----------------------
def decompress_image_vq(input_path, output_path):
    with open(input_path, 'rb') as f:
        width, height, num_colors = struct.unpack('>IIH', f.read(10))
        palette = np.frombuffer(f.read(num_colors * 3), dtype=np.uint8).reshape(num_colors, 3)
        labels = np.frombuffer(f.read(), dtype=np.uint8)

    pixels = palette[labels]
    image = Image.fromarray(pixels.reshape(height, width, 3), 'RGB')
    image.save(output_path)
    print(f"Decompressed {input_path} -> {output_path}")

# --------------------
# Example Usage
# --------------------
# Compress
compress_image_vq("input.jpg", "compressed.vqimg", num_colors=64)

# Decompress
decompress_image_vq("compressed.vqimg", "output.jpg")
