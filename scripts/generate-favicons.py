#!/usr/bin/env python3
import os
import struct
from PIL import Image
import numpy as np

def generate_favicons():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_path = os.path.join(root_dir, 'public', 'assets', 'jmg-logo-reference.png')
    public_dir = os.path.join(root_dir, 'public')

    if not os.path.exists(src_path):
        raise FileNotFoundError(f"Source logo not found at {src_path}")

    print(f"Loading source logo from: {src_path}")
    im = Image.open(src_path).convert('RGB')
    arr = np.array(im, dtype=np.float64)

    # 1. Exact mathematical alpha unblending from pure white (255, 255, 255)
    min_c = np.min(arr, axis=2)
    alpha = np.clip(1.0 - min_c / 255.0, 0.0, 1.0)

    fg = np.zeros_like(arr)
    mask = alpha > 0.001
    for c in range(3):
        fg[mask, c] = np.clip((arr[mask, c] - (1.0 - alpha[mask]) * 255.0) / alpha[mask], 0.0, 255.0)

    rgba = np.dstack([fg, alpha * 255.0]).astype(np.uint8)
    full_transparent = Image.fromarray(rgba, 'RGBA')

    # 2. Crop to tight bounding box of the logo
    bbox = full_transparent.getbbox()
    cropped = full_transparent.crop(bbox)
    print(f"Cropped logo dimensions: {cropped.size[0]}x{cropped.size[1]} (aspect ratio {cropped.size[0]/cropped.size[1]:.3f})")

    # 3. Helper to create square canvas with proportional centering and padding
    def create_square_icon(canvas_size, width_ratio):
        canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
        target_w = int(round(canvas_size * width_ratio))
        aspect = cropped.height / cropped.width
        target_h = int(round(target_w * aspect))
        target_h = max(1, target_h)

        resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
        pos_x = (canvas_size - target_w) // 2
        pos_y = (canvas_size - target_h) // 2
        canvas.paste(resized, (pos_x, pos_y), mask=resized.split()[3])
        return canvas

    # 4. Generate all required sizes
    # Generous ratios for small sizes to maximize legibility; balanced ratio for larger sizes
    icon_512 = create_square_icon(512, 0.85)
    icon_192 = create_square_icon(192, 0.85)
    icon_180 = create_square_icon(180, 0.85)
    icon_32  = create_square_icon(32, 0.88)
    icon_16  = create_square_icon(16, 0.88)

    targets = [
        ('favicon-512x512.png', icon_512),
        ('favicon-192x192.png', icon_192),
        ('apple-touch-icon.png', icon_180),
        ('favicon-32x32.png', icon_32),
        ('favicon-16x16.png', icon_16),
    ]

    for name, img in targets:
        # Save to public/
        pub_path = os.path.join(public_dir, name)
        img.save(pub_path, 'PNG', optimize=True)
        # Save to root ./
        root_path = os.path.join(root_dir, name)
        img.save(root_path, 'PNG', optimize=True)
        print(f"✓ Created {name} ({img.size[0]}x{img.size[1]})")

    # 5. Multi-resolution favicon.ico (16x16 and 32x32)
    ico_pub_path = os.path.join(public_dir, 'favicon.ico')
    ico_root_path = os.path.join(root_dir, 'favicon.ico')
    
    # Save multi-size ICO containing 16x16 and 32x32
    icon_32.save(ico_pub_path, format='ICO', sizes=[(16, 16), (32, 32)], append_images=[icon_16])
    icon_32.save(ico_root_path, format='ICO', sizes=[(16, 16), (32, 32)], append_images=[icon_16])
    print("✓ Created favicon.ico with (16x16, 32x32) multi-resolution frames")

    # 6. Verify ICO binary structure
    with open(ico_pub_path, 'rb') as f:
        data = f.read()
    magic, ico_type, count = struct.unpack('<HHH', data[:6])
    print(f"✓ favicon.ico validation: type={ico_type}, embedded frame count={count}")

    print("\nFavicon generation complete!")

if __name__ == '__main__':
    generate_favicons()

