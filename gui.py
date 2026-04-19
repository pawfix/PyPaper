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
        try:
            ownLog(f"Downloading wallpaper: {id}")
            filepath = downloadWallpaper(id, True, save_dir)
            if not filepath:
                raise Exception("Failed to download wallpaper")
            return filepath
        except Exception as e:
            ownLog(f"Error downloading wallpaper: {e}")
            raise Exception(f"Download failed: {e}")

    def setWallpaper(self, id, save_dir, handler):
        """Download and apply wallpaper"""
        try:
            ownLog(f"Setting wallpaper: {id} with handler: {handler}")
            applyWallpaper(id, handler, save_dir)
        except Exception as e:
            ownLog(f"Error setting wallpaper: {e}")
            raise Exception(f"Failed to set wallpaper: {e}")
    
    def applyLocalWallpaper(self, filepath, handler):
        """Apply a local wallpaper file"""
        try:
            ownLog(f"Applying local wallpaper: {filepath} with handler: {handler}")

            if not filepath or not os.path.isfile(filepath):
                raise FileNotFoundError(f"Local wallpaper not found: {filepath}")

            # Use the handler to apply the wallpaper
            from wallpaper import runHandler
            runHandler(handler, filepath)
        except Exception as e:
            ownLog(f"Error applying local wallpaper: {e}")
            raise Exception(f"Failed to apply local wallpaper: {e}")

api = Api()
webview.create_window('PyPaper', 'site/index.html', js_api=api)
webview.start()



