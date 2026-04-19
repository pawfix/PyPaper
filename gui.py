import webview
from api import search_wallpapers
from main import ownLog, downloadWallpaper
from wallpaper import applyWallpaper
from local import getLocalFiles
import os
import subprocess

class Api():
    def getData(self, user_input, key, purity):
        data = search_wallpapers(user_input, key, purity)
        """Python function that takes input from JS"""
        ownLog(f"Python received input: {user_input}")
        # Example: return some processed data
        return data

    def downloadWallpaper(self, id, save_dir):
        """Download wallpaper without applying"""
        ownLog(f"Downloading wallpaper: {id}")
        filepath = downloadWallpaper(id, True, save_dir)
        return filepath

    def setWallpaper(self, id, save_dir, handler):
        """Download and apply wallpaper"""
        ownLog(f"Setting wallpaper: {id} with handler: {handler}")
        applyWallpaper(id, handler, save_dir)

    def getFiles(self, fileDir):
        ownLog(f"Got dir {fileDir}")
        dirJson = getLocalFiles(fileDir)
        ownLog(dirJson)
        return dirJson
    
    def applyLocalWallpaper(self, filepath, handler):
        """Apply a local wallpaper file"""
        ownLog(f"Applying local wallpaper: {filepath} with handler: {handler}")

        if not filepath or not os.path.isfile(filepath):
            raise FileNotFoundError(f"Local wallpaper not found: {filepath}")

        # Use the handler to apply the wallpaper
        from wallpaper import runHandler
        runHandler(handler, filepath)

api = Api()
webview.create_window('PyPaper', 'site/index.html', js_api=api)
webview.start()



