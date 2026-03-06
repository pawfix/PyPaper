from main import downloadWallpaper
import subprocess
import shutil

def whichWallHandler(handler):
    if shutil.which(handler) is not None:
        return 1;
    else:
        return 0;

def applyWallpaper(id, handler: str):
    filepath = downloadWallpaper(id, True);
    if whichWallHandler(handler) is not 0:
        subprocess.run([handler, "img", filepath]);
    else:
        print(handler + "not aviable")
