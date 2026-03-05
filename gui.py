import webview
from api import search_wallpapers
from main import ownLog
from wallpaper import applyWallpaper

class Api():
    def getData(self, user_input):
        data = search_wallpapers(user_input)
        """Python function that takes input from JS"""
        print(f"Python received input: {user_input}")
        # Example: return some processed data
        return data
    def setWallpaper(self, id):
        print(id),
        applyWallpaper(id, "swww")

api = Api()
webview.create_window('PyPaper', '././site/index.html', js_api=api)
webview.start(debug=True)


