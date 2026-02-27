# Imports

import requests
import subprocess # Will use for setting wallpaper
import argparse # For cli arguments
from tqdm import tqdm # For download bar
import os

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

args = parser.parse_args()

if args.log:
    print("enabled logging")

def ownLog(log):
    if args.log:
        print(log)

# Logic for the Wallhaven API
url = "https://wallhaven.cc/api/v1/search"

if args.download:
    q = input("Search: ")
else:
    q = 0

# Params
# TODO: add an option to use custom categories or purity
params = {
    "q": q,
    "categories": "111",
    "purity": "100",
    "sorting": "toplist",
    "order": "desc"
        }

# Ask for data from API
response = requests.get(url, params=params)
data = response.json()

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
    filepath = os.path.join("images", filename)

    image = requests.get(image_url, stream=True)
    ownLog(image)

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

    ownLog("downloaded:", filename)

if args.download:
    getWallpapers(data)

