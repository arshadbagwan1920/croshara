import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = Path("C:/Users/ARSHAD/OneDrive/Desktop/CROSHARA/site/public/images")
CONTENT = Path("C:/Users/ARSHAD/OneDrive/Desktop/CROSHARA/automation/content")

PINK = (232, 160, 180)
PINK_DARK = (212, 132, 154)
NAVY = (26, 26, 46)
CREAM = (253, 246, 240)
WHITE = (255, 255, 255)

def get_font(size, bold=False):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/georgia.ttf" if not bold else "C:/Windows/Fonts/georgiab.ttf", size)
    except:
        try:
            return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
        except:
            return ImageFont.load_default()

def draw_bg(draw, w, h, accent):
    draw.rectangle([0, 0, w, h], fill=CREAM)
    draw.ellipse([w-200, -100, w+100, 300], fill=(*accent, 25))
    draw.ellipse([-100, h-200, 300, h+100], fill=(*accent, 20))
    draw.ellipse([w//2-250, h//2-250, w//2+250, h//2+250], fill=(*accent, 10))

def draw_logo(draw, x, y):
    draw.rounded_rectangle([x, y, x+200, y+32], radius=16, fill=(*PINK, 40))
    draw.text((x+12, y+6), "CROSHARA", fill=NAVY, font=get_font(16, True))
    draw.rectangle([x, y+36, x+45, y+38], fill=PINK)

def generate_product_image(name, accent, badge, filename, sock_color):
    w, h = 600, 600
    img = Image.new("RGB", (w, h), CREAM)
    draw = ImageDraw.Draw(img)
    draw_bg(draw, w, h, accent)
    draw_logo(draw, 30, 20)

    draw.rounded_rectangle([80, 120, 520, 480], radius=40, fill=(*WHITE, 220), outline=(*accent, 50), width=2)

    body_color = sock_color or (180, 200, 220)
    draw.ellipse([200, 180, 400, 350], fill=body_color)
    draw.ellipse([200, 180, 400, 350], fill=(*body_color, 200), outline=accent, width=3)
    draw.ellipse([230, 210, 280, 260], fill=WHITE)
    draw.ellipse([320, 210, 370, 260], fill=WHITE)
    draw.pieslice([230, 210, 370, 350], 180, 360, fill=(*body_color, 150))
    draw.ellipse([160, 300, 240, 360], fill=body_color)
    draw.ellipse([360, 300, 440, 360], fill=body_color)
    draw.ellipse([160, 300, 240, 360], outline=accent, width=2)
    draw.ellipse([360, 300, 440, 360], outline=accent, width=2)

    draw.text((300, 250), "CROSHARA", fill=NAVY, font=get_font(28, True), anchor="mm")
    draw.text((300, 295), "BABY", fill=accent, font=get_font(16), anchor="mm")

    if badge:
        draw.rounded_rectangle([210, 430, 390, 470], radius=20, fill=accent)
        draw.text((300, 450), badge, fill=WHITE, font=get_font(16, True), anchor="mm")

    draw.rounded_rectangle([60, 530, 540, 570], radius=16, fill=(*NAVY, 8))
    draw.text((300, 550), "Handmade Pure Wool · Barefoot Friendly", fill=(*NAVY, 100), font=get_font(12), anchor="mm")

    img.save(OUT_DIR / filename, "JPEG", quality=90)
    print(f"  Created: {filename}")

def main():
    products = [
        ("product-newborn.jpg", "Newborn Set", PINK, "Bestseller", (232, 180, 200)),
        ("product-infant.jpg", "Infant Set", (152, 200, 180), "Popular", (160, 210, 190)),
        ("product-toddler.jpg", "Toddler Set", (26, 26, 46), "Tough Range", (50, 60, 100)),
        ("product-gift-set.jpg", "Gift Box", PINK, "Gift Ready", (232, 180, 200)),
        ("product-festival.jpg", "Festival Set", (200, 100, 50), "Festive Special", (220, 140, 80)),
        ("product-custom.jpg", "Custom Order", (150, 100, 150), "Made to Order", (170, 130, 170)),
    ]
    for fname, name, accent, badge, sock in products:
        generate_product_image(name, accent, badge, fname, sock)
    print("Done!")

if __name__ == "__main__":
    main()
