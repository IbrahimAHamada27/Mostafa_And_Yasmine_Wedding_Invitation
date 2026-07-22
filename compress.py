from PIL import Image
import os
import sys

def compress_images():
    try:
        # Compress background image
        if os.path.exists('bg-sketch.png'):
            img = Image.open('bg-sketch.png')
            bg = Image.new("RGB", img.size, (255,255,255))
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                bg.paste(img, mask=img.split()[3])
            else:
                bg = img.convert('RGB')
            # Resize if it's too huge
            if img.size[0] > 1920:
                ratio = 1920.0 / img.size[0]
                new_size = (1920, int(img.size[1] * ratio))
                bg = bg.resize(new_size, Image.Resampling.LANCZOS)
            bg.save('bg-sketch.jpg', 'JPEG', quality=60)
            print("Compressed bg-sketch.png to bg-sketch.jpg")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    compress_images()
