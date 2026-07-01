import os, sys, math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

CONTENT = Path("C:/Users/ARSHAD/OneDrive/Desktop/CROSHARA/automation/content")

PINK = (232, 160, 180)
PINK_DARK = (212, 132, 154)
NAVY = (26, 26, 46)
CREAM = (253, 246, 240)
WHITE = (255, 255, 255)
WARM = (245, 230, 211)

def get_font(size, bold=False):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/georgia.ttf" if not bold else "C:/Windows/Fonts/georgiab.ttf", size)
    except:
        try:
            return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", size)
        except:
            return ImageFont.load_default()

def draw_brand_bg(draw, w, h):
    draw.rectangle([0, 0, w, h], fill=CREAM)
    draw.ellipse([w-280, 40, w-40, 280], fill=(*PINK, 20))
    draw.ellipse([40, h-280, 280, h-40], fill=(*PINK, 15))
    draw.ellipse([w//2-200, h//2-200, w//2+200, h//2+200], fill=(*PINK, 10))

def draw_logo(draw, x, y, w):
    draw.rounded_rectangle([x, y, x+220, y+36], radius=18, fill=(*PINK, 40))
    draw.text((x+16, y+6), "CROSHARA", fill=NAVY, font=get_font(18, True))
    draw.text((x+236, y+8), "BABY", fill=PINK, font=get_font(12))
    draw.rectangle([x, y+40, x+50, y+42], fill=PINK)
    return y+50

def draw_footer(draw, w, h):
    draw.rectangle([60, h-80, w-60, h-78], fill=(*PINK, 50))
    draw.text((80, h-60), "COMFORT FIT . NON-SLIP SOLE . HANDMADE", fill=(*NAVY, 100), font=get_font(12))
    draw.ellipse([80, h-42, 88, h-34], fill=PINK)
    draw.text((96, h-42), "Follow @crosharahandmade", fill=(*NAVY, 60), font=get_font(11))
    draw.rounded_rectangle([w-180, h-55, w-60, h-32], radius=14, fill=(*NAVY, 10))
    draw.text((w-168, h-48), "SHOP NOW", fill=PINK, font=get_font(11, True))
    draw.polygon([(w-58, h-44), (w-48, h-49), (w-48, h-39)], fill=PINK)

def generate_day_image(folder, day):
    w, h = 1080, 1080
    img = Image.new("RGB", (w, h), CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_brand_bg(draw, w, h)
    y_top = draw_logo(draw, 80, 40, w)
    
    themes = {
        "14-toddler": ("Toddler Shoes", "For Active Little Explorers", "6 - 24 MONTHS", "👶🏃"),
        "15-mom-tips": ("Mom Tips", "Keep Baby Warm This Winter", "WARMTH GUIDE", "👩📋"),
        "16-shipping": ("All India Shipping", "Free Delivery • Tracked Orders", "SHOP FROM HOME", "📦🚚"),
        "17-sneak-peek": ("Coming Soon", "New Pastels & Gift Boxes", "DROPPING SOON", "👀✨"),
        "18-custom": ("Custom Orders", "Your Design • Your Colors", "DM TO ORDER", "🎨✂️"),
        "19-winter": ("Winter Ready", "3x Warmer Than Cotton", "PURE WOOL", "❄️🧶"),
        "20-family": ("Matching Sets", "Perfect for Siblings", "PAIR & SAVE", "👶👶"),
        "21-birth-gift": ("Birth Gift", "The Perfect Baby Shower Gift", "GIFT WRAPPED", "🎁💝"),
        "22-quality": ("Premium Quality", "Handmade • Pure Wool", "BEST VALUE", "⭐👌"),
        "23-artisan": ("Made by Artisans", "15+ Years of Craft", "SUPPORT HANDMADE", "🧵🙌"),
        "24-sizing": ("Size Guide", "Find Your Perfect Fit", "0 - 24 MONTHS", "📏👣"),
        "25-reel-bts": ("Behind the Scenes", "From Skein to Shoe", "4+ HOURS EACH", "🎬🔍"),
        "26-reel-product": ("All 6 Colors", "Blush • Mint • Cream • Navy • Grey • Walnut", "SHOP ALL", "🌈✨"),
        "27-reel-tips": ("Pro Tips", "How to Keep Shoes On", "STAYS PUT", "💡👟"),
        "28-reel-unbox": ("Unboxing", "Premium Gift Experience", "GIFT READY", "📦🎀"),
        "29-reel-review": ("5-Star Reviews", "Loved by 50+ Families", "TRUSTED", "⭐💬"),
        "30-reel-offer": ("The Complete Collection", "30 Days • One Brand", "SHOP CROSHARA", "🏆✨"),
    }
    
    theme = themes.get(folder, ("CROSHARA", "Handmade Baby Shoes", "DM TO ORDER", "🧶"))
    
    card_l = 200
    card_t = 200
    card_w = 680
    card_h = 420
    
    # Draw main card
    draw.rounded_rectangle([card_l, card_t, card_l+card_w, card_t+card_h], radius=30, fill=(*WHITE, 220),
                          outline=(*PINK, 77), width=2)
    
    # Emoji in center
    emoji = theme[3]
    draw.text((540, 280), emoji, fill=NAVY, font=get_font(60), anchor="mm")
    
    # Title
    draw.text((540, 360), theme[0], fill=NAVY, font=get_font(42, True), anchor="mm")
    
    # Subtitle
    draw.text((540, 420), theme[1], fill=(*NAVY, 180), font=get_font(22), anchor="mm")
    
    # Badge
    badge_w = 320
    badge_h = 50
    draw.rounded_rectangle([540-badge_w//2, 470, 540+badge_w//2, 470+badge_h], radius=25, fill=PINK)
    draw.text((540, 495), theme[2], fill=WHITE, font=get_font(20, True), anchor="mm")
    
    # Decorative circles
    draw.ellipse([220, 560, 260, 600], fill=(*PINK, 30))
    draw.ellipse([820, 560, 860, 600], fill=(*PINK, 30))
    
    draw_footer(draw, w, h)
    
    # Day badge
    draw.rounded_rectangle([440, 660, 640, 700], radius=20, fill=NAVY)
    draw.text((540, 680), f"Day {day} of 30", fill=WHITE, font=get_font(16, True), anchor="mm")
    
    output = folder / "image.jpg"
    img.save(output, "JPEG", quality=92)
    print(f"  Created: {output.name} ({os.path.getsize(output)} bytes)")

def main():
    for folder in sorted(CONTENT.iterdir()):
        if not folder.is_dir():
            continue
        name = folder.name
        try:
            day = int(name.split("-")[0])
        except:
            continue
        
        svg_file = folder / "image.svg"
        jpg_file = folder / "image.jpg"
        
        if day >= 14:
            print(f"\n[{day}] {name}: needs image")
            generate_day_image(folder, day)
        else:
            if not jpg_file.exists():
                print(f"\n[{day}] {name}: no JPG, generating")
                generate_day_image(folder, day)
            else:
                print(f"\n[{day}] {name}: has JPG ({os.path.getsize(jpg_file)} bytes)")
    
    print("\nDone generating images!")

if __name__ == "__main__":
    main()
