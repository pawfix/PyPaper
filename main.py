# Imports

import requests # For handling API requests
import subprocess # Will use for setting wallpaper
import argparse # For cli arguments
from tqdm import tqdm # For download bar
import shutil # Check if command exists
import tempfile # For enabling temp file used in CLi image
import sys
import os
from api import search_wallpapers



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
            ownLog("Failed to download thumbnail: ", e)
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

if args.download:
    if args.cli:
        q = input("Search: ")
        data = search_wallpapers(q)

# Get list of wallpapers from recived data
def getWallpapers(data):
    
    ownLog(data) 
    if data["data"] == []:
        print("No wallpaper found for your query: " + q)
        exit()
    if "data" in data:
        wallNumber = 1
        for wallpaper in data["data"]:
            print("=================")
            print(wallpaper["id"])
            showImage(wallpaper["thumbs"]["small"])
            print(wallpaper["url"])
            print(wallpaper["path"])
            print("=================")
            wallNumber += 1
    else:
        print("No data: " + data)


    choiceID = input("Chose wallpaper ID to download: ")
    if not choiceID:
        print("Enter a proper ID")
    else:
        downloadWallpaper(choiceID)

def downloadWallpaper(ID):
    url = f"https://wallhaven.cc/api/v1/w/{ID}"

    response = requests.get(url)
    data = response.json()
    image_url = data["data"]["path"]

    filename = image_url.split("/")[-1]

    os.makedirs("images", exist_ok=True)

    filepath = os.path.join("images", filename)

    image = requests.get(image_url, stream=True)

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

if args.download:
    if args.cli:
        getWallpapers(data)

