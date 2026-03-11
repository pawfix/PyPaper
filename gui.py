import webview
from api import search_wallpapers
from main import ownLog
from wallpaper import applyWallpaper
from local import getLocalFiles
import os

class Api():
    def getData(self, user_input, key, purity):
        data = search_wallpapers(user_input, key, purity)
        """Python function that takes input from JS"""
        ownLog(f"Python received input: {user_input}")
        # Example: return some processed data
        return data

    def setWallpaper(self, id, save_dir, handler):
        ownLog(f"Setting wallpaper: {id}")
        applyWallpaper(id, handler, save_dir)

    def getFiles(self, fileDir):
        ownLog(f"Got dir {fileDir}")
        dirJson = getLocalFiles(fileDir)
        ownLog(dirJson)
        return dirJson
    
    def applyLocalWallpaper(self, filepath):
    
        import subprocess

        if not filepath or not os.path.isfile(filepath):
            raise FileNotFoundError(f"Local wallpaper not found: {filepath}")

        handler = "swww"

        # Use subprocess to set wallpaper
        subprocess.run([handler, "img", filepath])

api = Api()
webview.create_window('PyPaper', '././site/index.html', js_api=api)
webview.start()


