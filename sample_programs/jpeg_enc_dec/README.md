# JPEG Compression and Decompression Educational Demo

This project provides a comprehensive educational demonstration of JPEG compression and decompression, implementing the core concepts step-by-step to teach spatial compression principles.

## 🎯 Learning Objectives

Understand the three fundamental steps of JPEG spatial compression:

1. **DCT (Discrete Cosine Transform)** - Transform spatial domain to frequency domain
2. **Quantization** - Reduce precision of frequency coefficients (lossy step)
3. **Entropy Coding** - Huffman coding for lossless compression

And their exact inverse operations for reconstruction.

## 📚 What You'll Learn

- How DCT concentrates image energy in low frequencies
- Why quantization is the primary source of compression artifacts
- How Huffman coding provides lossless compression of quantized data
- The complete encode/decode pipeline with binary file storage
- Trade-offs between compression ratio and image quality
- Block-based processing and its artifacts

## 🛠 Prerequisites

- **Python 3.7+**
- **Jupyter Notebook** or **JupyterLab**

## 📦 Installation

1. **Navigate to the directory:**
   ```bash
   cd sample_programs/jpeg_enc_dec
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Jupyter:**
   ```bash
   jupyter notebook
   ```

4. **Open the demo notebook:**
   - Open `jpeg_compression_demo.ipynb`
   - Run all cells to see the complete demonstration

## 📓 Notebook Contents

### Step 1: Image Preparation
- Creates test images with various patterns
- Explains 8×8 block processing

### Step 2: DCT Transform
- Implements 2D DCT and inverse DCT from scratch
- Visualizes frequency domain representation
- Shows energy concentration in low frequencies

### Step 3: Quantization
- Applies JPEG quantization table
- Demonstrates quality vs compression trade-offs
- Shows dequantization process

### Step 4: Huffman Coding
- Implements complete Huffman encoder/decoder
- Uses zigzag ordering for coefficient arrangement
- Demonstrates entropy compression

### Step 5: Complete Pipeline
- Processes entire images in 8×8 blocks
- Saves compressed data to binary files
- Implements full decoder from binary data

### Step 6: Analysis and Visualization
- Comprehensive quality metrics (MSE, PSNR)
- Side-by-side comparisons
- Compression ratio analysis

## 🗂 Generated Files

The notebook creates:
- `compressed_image.bin` - Binary file containing compressed image data
- Intermediate visualization plots
- Quality analysis charts

## 🔬 Key Educational Features

- **Step-by-step visualization** of each compression stage
- **Before/after comparisons** showing compression effects
- **Interactive exploration** of different quality levels
- **Complete implementation** - no black box libraries
- **Binary file demonstration** showing real-world storage

## 📊 Compression Results

Typical results on test images:
- **Compression ratio:** 3-10:1 depending on image content
- **Quality loss:** Controlled through quantization table
- **Processing:** Real-time for small images

## 🎓 Educational Use

Perfect for:
- **Computer Science courses** on multimedia and image processing
- **Engineering students** learning about lossy compression
- **Self-study** of JPEG internals
- **Research** into compression algorithms

## 🔧 Customization

Easily modify:
- **Quantization tables** for different quality levels
- **Block sizes** (though 8×8 is JPEG standard)
- **Test images** to see effects on different content types
- **Visualization parameters** for better understanding

## 📚 Reference Implementation

This implementation is inspired by the JPEG standard (ISO/IEC 10918-1) and educational resources. For a more advanced reference implementation, see: https://github.com/misingnoglic/jpeg_compresser

## 🐛 Troubleshooting

**Common Issues:**
- **Import errors:** Ensure all requirements are installed
- **Memory issues:** Use smaller test images for large demonstrations
- **Jupyter issues:** Make sure Jupyter is properly installed and running

**Performance Notes:**
- This is an educational implementation optimized for clarity, not speed
- Real-world JPEG encoders use optimized DCT implementations
- For production use, consider libraries like OpenCV or PIL/Pillow

## 🤝 Contributing

This is an educational tool. Suggestions for improvements in:
- Clarity of explanations
- Additional visualizations
- More comprehensive examples
- Better documentation

are welcome!

## 📄 License

Educational use - part of the video engineering documentation project.