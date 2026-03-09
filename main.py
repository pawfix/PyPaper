import requests # For handling API requests
import subprocess # Will use for setting wallpaper
import argparse # For cli arguments
from tqdm import tqdm # For download bar
import shutil # Check if command exists
import tempfile # For enabling temp file used in CLi image
import sys
import os
from api import search_wallpapers
from typing import Dict, Any

# Argument parser for logging
parser = argparse.ArgumentParser(
                    description='Enable logging')
# Add -l to enable logging. Add logs with ownLog(log)
parser.add_argument(
        "-l",
        "--log",
        help="Enable logging",
        action="store_true")

# Argument -d to download wallpapers.
parser.add_argument(
        "-d",
        "--download",
        help="Use this to download from cli",
        action="store_true")

# Argument -i to enable image preview
parser.add_argument(
    "-i",
    "--image",
    help="Show image preview in CLI",
    action="store_true")

# Argument -c to use CLI instead of GUI
parser.add_argument(
        "-c",
        "--cli",
        help="Use CLI instead of GUI(also requires -d to download)",
        action="store_true")

# Argument -a to apple wallpaper after download
parser.add_argument(
        "-a",
        "--apply",
        help="Apply the wallpaper after download",
        action="store_true")

# Argument -s to specify save directory
parser.add_argument(
        "-s",
        "--save-dir",
        help="Directory to save wallpapers (default: ./images)",
        default="./images")

args = parser.parse_args()

if not args.cli:
    import gui

if args.log:
    print("enabled logging")

def ownLog(log):
    if args.log:
        print(log)

# Display image handler in CLI
def showImage(thumb):
    if args.image:
        if not sys.stdout.isatty():
            ownLog("Not running in a TTY")
            return
        try:
            response = requests.get(thumb, timeout=10)
            response.raise_for_status()
        except Exception as e:
            ownLog("Failed to download thumbnail: {e}")
            print("Cant download preview")
            return
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name
        try:
            if "KITTY_WINDOW_ID" in os.environ:
                subprocess.run(["kitty", "+kitten", "icat", tmp_path])
            elif shutil.which("viu") is not None:
                subprocess.run(["viu", tmp_path])
            else: 
                ownLog("Inline Images not supported")
        finally:
            os.remove(tmp_path)
    else:
        return



def get_wallpapers(result: Dict[str, Any], query: str) -> None:
    ownLog(result)

    if not result.get("success", False):
        # Report why wallpapers weren't returned
        error_msg = result.get("error", "Unknown error")
        status_code = result.get("status_code")
        if status_code:
            print(f"Failed to fetch wallpapers (HTTP {status_code}): {error_msg}")
        else:
            print(f"Failed to fetch wallpapers: {error_msg}")
        return

    wallpapers = result.get("data", {}).get("data", [])
    if not wallpapers:
        print(f"No wallpapers found for your query: '{query}' (API returned empty data).")
        return

    for idx, wallpaper in enumerate(wallpapers, start=1):
        print(f"================= Wallpaper {idx} =================")
        print(f"ID: {wallpaper.get('id')}")
        showImage(wallpaper["thumbs"]["small"])
        print(f"URL: {wallpaper.get('url')}")
        print(f"Path: {wallpaper.get('path')}")
        print("==================================================")

    # Ask user for a wallpaper ID
    choice_id = input("Choose wallpaper ID to download: ").strip()
    if not choice_id:
        print("Enter a proper ID")
    else:
        downloadWallpaper(choice_id, False)

def downloadWallpaper(ID: str, called: bool, save_dir: str = None):
    if save_dir is None:
        save_dir = args.save_dir

    save_dir = os.path.expanduser(save_dir)

    # Check if save_dir is writable
    if not os.path.exists(save_dir):
        try:
            os.makedirs(save_dir, exist_ok=True)
        except OSError as e:
            print(f"Failed to create directory {save_dir}: {e}")
            return None
    if not os.access(save_dir, os.W_OK):
        print(f"Directory {save_dir} is not writable")
        return None

    filepath = None

    if args.apply and called is not True:
        from wallpaper import applyWallpaper
        handler = input("Chose your handler (swww): ")
        applyWallpaper(ID, handler)

    try:
        url = f"https://wallhaven.cc/api/v1/w/{ID}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        image_url = data["data"]["path"]
        filename = image_url.split("/")[-1]

        os.makedirs(save_dir, exist_ok=True)
        filepath = os.path.join(save_dir, filename)

        image = requests.get(image_url, stream=True, timeout=15)
        image.raise_for_status()

        total_size = int(image.headers.get("content-length", 0))
        chunk_size = 1024

        with open(filepath, "wb") as f, tqdm(
            desc=filename,
            total=total_size,
            unit="B",
            unit_scale=True,
            unit_divisor=1024,
        ) as bar:
            for chunk in image.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
                    bar.update(len(chunk))

        print(f"Downloaded: {filepath}")

    except requests.exceptions.RequestException as e:
        print(f"Failed to download wallpaper {ID}: {e}")

    return filepath

if __name__ == "__main__":
    if args.download:
        if args.cli:
            q = input("Search: ")
            data = search_wallpapers(q)
            get_wallpapers(data, q)
