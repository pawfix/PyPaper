import webview
from api import search_wallpapers
from main import ownLog
from wallpaper import applyWallpaper

class Api():
    def getData(self, user_input, key, purity):
        data = search_wallpapers(user_input, key, purity)
        """Python function that takes input from JS"""
        ownLog(f"Python received input: {user_input}")
        # Example: return some processed data
        return data
    def setWallpaper(self, id, save_dir):
        ownLog(f"Setting wallpaper: {id}")
        applyWallpaper(id, "swww", save_dir)

api = Api()
webview.create_window('PyPaper', '././site/index.html', js_api=api)
webview.start()


