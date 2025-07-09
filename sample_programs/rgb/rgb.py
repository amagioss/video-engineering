"""
Usage: python rgb.py <input_image_path> [<output_image_path>]
"""
import os
import argparse
from PIL import Image
import numpy as np
import math

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

def crop_image(image_path, top_left, size, output_path):
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

def save_rgb_buffer(image_path, output_path):
    """
    Loads a JPEG image, converts to RGB, and writes the raw RGB buffer to a file.

    Args:
        image_path (str): Path to input JPEG image.
        output_path (str): Path to output .rgb file (raw RGB buffer).
    """
    # Load image and convert to RGB
    image = Image.open(image_path).convert("RGB")
    rgb_array = np.array(image)  # Shape: (H, W, 3)

    # Flatten the array to 1D byte stream
    raw_bytes = rgb_array.tobytes()

    # Write to file
    with open(output_path, "wb") as f:
        f.write(raw_bytes)

    print(f"Saved raw RGB buffer to: {output_path}")
    print(f"Image resolution: {image.size} (width x height)")
    print(f"Total bytes written: {len(raw_bytes)} (3 x width x height)")


def replace_last_pixels(image_path, output_path, replacement_color=(255, 255, 255)):
    """
    Loads an image and replaces the bottom-right 2x2 pixels with a solid color using basic array manipulation.
    Args:
        image_path (str): Path to input image.
        output_path (str): Path to save modified image.
        replacement_color (tuple): (R, G, B) color to apply to the 2x2 block.
    """
    # Open image and convert to RGB
    with open(image_path, "rb") as f:
        pixel_bytes = f.read()

    print("Type of pixel_bytes:", type(pixel_bytes))
    print("Length of pixel_bytes:", len(pixel_bytes))
    print("First 10 bytes:", pixel_bytes[:10])

    width = int(math.sqrt(len(pixel_bytes) // 3))
    height = width

    pixel_bytes = list(pixel_bytes)

    row_stride = width * 3
    channels = 3

    replace_width = 100
    replace_height = 100
    # Modify last 2×2 pixels (bottom-right)
    for y_offset in range(replace_height):
        for x_offset in range(replace_width):
            x = width - replace_width + x_offset
            y = height - replace_height + y_offset

            idx = y * row_stride + x * channels
            for i in range(3):
                pixel_bytes[idx + i] = replacement_color[i]

    # Convert modified list back to bytes and create new image
    modified_bytes = bytes(pixel_bytes)
    modified_img = Image.frombytes("RGB", (width, height), modified_bytes)
    modified_img.save(output_path)
    print(f"Saved image with modified 2x2 pixels at: {output_path}")


def load_buffer_from_file(file_path):
    """
    Loads raw bytes from a given file.

    Args:
        file_path (str): Path to the file to read.

    Returns:
        bytes: The contents of the file as a byte buffer.
    """
    try:
        with open(file_path, "rb") as f:
            data = f.read()
            print(f"Loaded {len(data)} bytes from '{file_path}'")
            return data
    except FileNotFoundError:
        print(f"Error: File not found - '{file_path}'")
        return None
    except IOError as e:
        print(f"Error reading file: {e}")
        return None

def print_hex_bytes(byte_data, columns=16):
    """
    Prints the given byte data in hexadecimal format with the specified number of columns.

    Args:
        byte_data (bytes or bytearray): The input binary data to print.
        columns (int): Number of bytes per line.
    """
    for i in range(0, len(byte_data), columns):
        line = byte_data[i:i+columns]
        hex_line = ' '.join(f"{byte:02X}" for byte in line)
        print(hex_line)

def create_output_path(input_path):
    """
    Creates an output path for the cropped image.
    
    Args:
        input_path (str): Path to the original JPEG image.
    """
    return os.path.join(os.path.dirname(input_path), "cropped_image.jpg")

def main():
    """
    Main function to parse arguments and execute the appropriate subcommand.
    """
    parser = argparse.ArgumentParser(description="RGB image utility with subcommands.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Crop subcommand
    crop_parser = subparsers.add_parser("crop", help="Crop a rectangle from an image and save it.")
    crop_parser.add_argument("-i", "--input_image", type=str, help="Path to the input image.")
    crop_parser.add_argument("-o", "--output_image", type=str,
                             help="Path to save the cropped image.")
    crop_parser.add_argument("--x", type=int,
                             default=100, help="Top-left x coordinate (default: 100)")
    crop_parser.add_argument("--y", type=int,
                             default=100, help="Top-left y coordinate (default: 100)")
    crop_parser.add_argument("--width", type=int,
                             default=100, help="Width of the rectangle (default: 100)")
    crop_parser.add_argument("--height", type=int,
                             default=100, help="Height of the rectangle (default: 100)")

    # RGB subcommand
    rgb_parser = subparsers.add_parser("rgb",
                                       help="Extract RGB buffer from image and save as .rgb file.")
    rgb_parser.add_argument("-i", "--input_image", type=str,
                            help="Path to the input JPEG image.")
    rgb_parser.add_argument("-o", "--output_rgb", type=str,
                            help="Path to save the raw RGB buffer (.rgb file).")

    # Print subcommand
    print_parser = subparsers.add_parser("print",
                                         help="Print the raw RGB buffer in hexadecimal format.")
    print_parser.add_argument("-i", "--input_file", type=str,
                              help="Path to the .rgb file to print.")

    # Replace subcommand
    replace_parser = subparsers.add_parser("replace",
                                          help="Replace the last 2x2 pixels with a solid color.")
    replace_parser.add_argument("-i", "--input_image", type=str,
                                help="Path to the input image.")
    replace_parser.add_argument("-o", "--output_image", type=str,
                                help="Path to save the modified image.")

    args = parser.parse_args()


    if args.command == "crop":
        crop_image(
            args.input_image,
            (args.y, args.x),
            (args.height, args.width),
            args.output_image,
        )

    if args.command == "rgb":
        save_rgb_buffer(args.input_image, args.output_rgb)

    if args.command == "print":
        print_hex_bytes(load_buffer_from_file(args.input_file))

    if args.command == "replace":
        replace_last_pixels(args.input_image, args.output_image)

if __name__ == "__main__":
    main()
