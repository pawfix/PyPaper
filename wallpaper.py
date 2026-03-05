from main import downloadWallpaper
import subprocess
import shutil

def isHyprpaper():
    if shutil.which('hyprpaper') is not None:
        return True
    else:
        return False

def isSddm():
    if shutil.which('swww') is not None:
        return True
    else:
        return False


def applyWallpaper(id, handler):
    filepath = downloadWallpaper(id);
    subprocess.run(handler, "img", filepath)
