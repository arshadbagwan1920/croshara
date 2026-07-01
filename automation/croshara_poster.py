import os, json, time, random, logging, sys, webbrowser
from pathlib import Path
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s',
    handlers=[logging.FileHandler('croshara_bot.log', encoding='utf-8'), logging.StreamHandler(sys.stdout)])
log = logging.getLogger(__name__)

CONFIG_FILE = Path("config.json")
CONTENT_DIR = Path("content")
POSTED_LOG = Path("posted.log")

def load_config():
    if not CONFIG_FILE.exists():
        username = input("Instagram username: ").strip()
        password = input("Instagram password: ").strip()
        CONFIG_FILE.write_text(json.dumps({"username": username, "password": password}, indent=2))
        log.info("Config saved")
    return json.loads(CONFIG_FILE.read_text())

def load_content():
    if not CONTENT_DIR.exists():
        log.error("Content folder not found")
        return []
    posts = []
    for folder in sorted(CONTENT_DIR.iterdir()):
        if not folder.is_dir():
            continue
        cap_file = folder / "caption.txt"
        media = sorted(f for f in folder.iterdir() if f.suffix in ['.jpg','.png','.mp4','.mov'])
        for svg in folder.glob("*.svg"):
            png = svg.with_suffix(".png")
            if not png.exists():
                try:
                    import subprocess
                    result = subprocess.run(
                        ["python", "-m", "playwright", "screenshot", str(svg), "--output", str(png)],
                        capture_output=True, timeout=30
                    )
                except:
                    pass
            if png.exists():
                media.append(png)
        if cap_file.exists() and media:
            posts.append({
                "day": int(folder.name.split("-")[0]) if "-" in folder.name else 0,
                "folder": folder.name,
                "caption": cap_file.read_text(encoding="utf-8").strip(),
                "media": sorted(media, key=lambda x: x.suffix),
                "type": "reel" if any(f.suffix in ['.mp4','.mov'] for f in media) else "post"
            })
    posts.sort(key=lambda x: x["day"])
    log.info(f"Loaded {len(posts)} posts")
    return posts

def load_posted():
    if not POSTED_LOG.exists():
        return set()
    return set(POSTED_LOG.read_text().strip().splitlines())

def mark_posted(folder_name):
    with open(POSTED_LOG, "a") as f:
        f.write(f"{folder_name}\n")

def get_today_post(posts, posted):
    for post in posts:
        if post["folder"] not in posted:
            return post
    return posts[0] if posts else None

def try_playwright_stealth(config, post):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.error("playwright not installed. Run: pip install playwright && python -m playwright install chromium")
        return False

    media_file = str(post["media"][0].absolute())
    caption = post["caption"]
    auth_file = Path("playwright_auth.json")

    log.info(f"Posting: {post['folder']}")
    log.info(f"Media: {media_file}")

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=False,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-web-security",
                    "--disable-features=IsolateOrigins,site-per-process"
                ],
                slow_mo=200
            )

            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                locale="en-IN",
                timezone_id="Asia/Kolkata",
                geolocation={"latitude": 19.0760, "longitude": 72.8777},
                permissions=["geolocation"],
                storage_state=str(auth_file) if auth_file.exists() else None,
                device_scale_factor={"mobile": True}
            )

            page = context.new_page()
            page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
                Object.defineProperty(navigator, 'languages', { get: () => ['en-IN', 'en', 'hi'] });
                window.chrome = { runtime: {} };
            """)

            if not auth_file.exists():
                log.info("=" * 50)
                log.info("  FRESH LOGIN REQUIRED")
                log.info("=" * 50)
                log.info("A browser window will open to Instagram.")
                log.info("Please log in manually in the browser.")
                log.info("The script will wait up to 5 minutes.")
                log.info("If you see a security check, complete it.")
                log.info("=" * 50)

                page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded")
                page.wait_for_timeout(2000)

                try:
                    page.wait_for_selector('[href="/accounts/login/"], [aria-label="Home"], article', timeout=300000)
                    page.wait_for_timeout(3000)
                except:
                    log.error("Timed out. Make sure you're logged in.")
                    browser.close()
                    return False

                try:
                    context.storage_state(path=str(auth_file))
                    log.info("Session saved for future runs!")
                except:
                    log.warning("Could not save session")

            if not auth_file.exists():
                log.error("No session saved. Cannot post.")
                browser.close()
                return False

            page.goto("https://www.instagram.com/", wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            try:
                page.wait_for_selector('[aria-label="New post"], [aria-label="Create"]', timeout=15000)
            except:
                page.goto("https://www.instagram.com/", wait_until="domcontentloaded")
                page.wait_for_timeout(3000)

            create_btn = page.query_selector('[aria-label="New post"], [aria-label="Create"]')
            if create_btn:
                create_btn.click()
            else:
                plus = page.query_selector('svg[aria-label="New post"]')
                if plus:
                    plus.click()
                else:
                    log.info("Browser is open - please post manually following the dashboard steps.")
                    log.info("After posting, press Enter here to continue...")
                    input()
                    mark_posted(post["folder"])
                    browser.close()
                    return True

            page.wait_for_timeout(3000)

            file_input = page.query_selector("input[type='file']")
            if file_input:
                file_input.set_input_files(media_file)
                page.wait_for_timeout(5000)

                next_btn = page.query_selector("div[role='button']:has-text('Next')")
                if next_btn:
                    next_btn.click()
                    page.wait_for_timeout(3000)

                next_btn2 = page.query_selector("div[role='button']:has-text('Next')")
                if next_btn2:
                    next_btn2.click()
                    page.wait_for_timeout(3000)

                caption_area = page.query_selector("[role='textbox']")
                if caption_area:
                    caption_area.click()
                    page.wait_for_timeout(500)
                    page.keyboard.type(caption, delay=30)
                    page.wait_for_timeout(1500)

                share_btn = page.query_selector("div[role='button']:has-text('Share')")
                if share_btn:
                    share_btn.click()
                    page.wait_for_timeout(10000)
                    mark_posted(post["folder"])
                    log.info(f"Posted: {post['folder']}!")
                    browser.close()
                    return True

            log.info("Auto-post flow incomplete. Browser is open.")
            input("Press Enter after posting manually...")
            mark_posted(post["folder"])
            browser.close()
            return True

    except Exception as e:
        log.error(f"Failed: {e}")
        return False

def main():
    print("=" * 50)
    print("  CROSHARA Instagram Auto-Poster")
    print("=" * 50)

    config = load_config()
    posts = load_content()
    if not posts:
        log.error("No content found")
        input("Press Enter to exit...")
        return

    posted = load_posted()
    post = get_today_post(posts, posted)

    if not post:
        log.info("All posts done! Starting over...")
        POSTED_LOG.unlink(missing_ok=True)
        post = posts[0]
        time.sleep(1)

    log.info(f"Today: {post['folder']}")
    log.info(f"Caption preview: {post['caption'][:60]}...")

    success = try_playwright_stealth(config, post)

    remaining = len(posts) - len(load_posted())
    log.info(f"{remaining} posts remaining")

    if success:
        time.sleep(5)
    else:
        print("\n" + "=" * 50)
        print("  TIP: Use posting dashboard from your phone:")
        print("  https://croshara.onrender.com/posting-dashboard.html")
        print("=" * 50)
        input("Press Enter to exit...")

if __name__ == "__main__":
    import time
    main()
