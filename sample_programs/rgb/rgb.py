"""
Usage: python rgb.py <input_image_path> [<output_image_path>]
"""
import os
import sys
from PIL import Image
import numpy as np

def load_image_as_rgb_buffer(image_path):
    """
    Loads an image as an RGB buffer.
    
    Args:
        image_path (str): Path to the original JPEG image.
    """
    # Open image using Pillow
    image = Image.open(image_path)
    image = image.convert("RGB")  # Ensure it's in RGB format

    # Get image resolution
    width, height = image.size
    print(f"Image resolution: {width} x {height}")

    # Convert image to numpy array (H x W x 3)
    rgb_array = np.array(image)

    # Print basic information
    print(f"Raw RGB buffer shape: {rgb_array.shape}")
    print(f"Top-left pixel RGB values: {rgb_array[0, 0]}")  # Example pixel access

    return rgb_array

def extract_and_save_rectangle(image_path, top_left, size, output_path):
    """
    Extracts a rectangle from an image and saves it as a new image.
    
    Args:
        image_path (str): Path to the original JPEG image.
        top_left (tuple): (y, x) coordinates of the top-left corner.
        size (tuple): (height, width) of the rectangle to extract.
        output_path (str): Path to save the new image.
    """
    # Load and convert to RGB
    image = Image.open(image_path).convert("RGB")
    rgb_array = np.array(image)

    y, x = top_left
    h, w = size

    # Ensure the rectangle stays within bounds
    y2 = min(y + h, rgb_array.shape[0])
    x2 = min(x + w, rgb_array.shape[1])

    # Extract the region
    cropped_region = rgb_array[y:y2, x:x2]

    # Convert back to an image and save
    cropped_image = Image.fromarray(cropped_region)
    cropped_image.save(output_path)

    print(f"Saved cropped image to {output_path} with size {cropped_image.size}")

# Example usage
if __name__ == "__main__test_1":
    _image_path = "/Users/vinodkumarpr/Downloads/fly_hammer.jpeg"  # Replace with the path to your JPEG file
    rgb_buffer = load_image_as_rgb_buffer(_image_path)

    # Accessing a central 100x100 block of the image
    center_y, center_x = rgb_buffer.shape[0] // 2, rgb_buffer.shape[1] // 2
    block = rgb_buffer[center_y-50:center_y+50, center_x-50:center_x+50]
    print("Central 100x100 RGB block shape:", block.shape)

def create_output_path(input_path):
    """
    Creates an output path for the cropped image.
    
    Args:
        input_path (str): Path to the original JPEG image.
    """
    return os.path.join(os.path.dirname(input_path), "cropped_image.jpg")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python rgb.py <input_image_path> [<output_image_path>]")
        sys.exit(1)

    _image_path = sys.argv[1]
    _output_path = sys.argv[2] if len(sys.argv) > 2 else create_output_path(_image_path)

    extract_and_save_rectangle(_image_path, (100, 100), (100, 100), _output_path)
