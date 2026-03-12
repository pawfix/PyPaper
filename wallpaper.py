from main import downloadWallpaper
import subprocess
import shutil

def whichWallHandler(handler):
    if shutil.which(handler) is not None:
        return 1;
    else:
        return 0;

def runHandler(handler, filepath):
    try:
        match handler:
            case "swww":
                subprocess.run(["swww", "img", filepath]);

            case 'awww':
                subprocess.run(["awww", "img", filepath]);

            case 'hyprpaper':
                subprocess.run([
                    "hyprctl",
                    "hyprpaper",
                    "wallpaper",
                    f", {filepath} , [ ]"
                ])

            case 'wpaperd':
                subprocess.run(["wpaperdctl", "set", filepath])
            
            case 'swaybg':
                subprocess.run(["swaybg", "-i", filepath])
            
            case _:
                print("Handler not supported")
    except:
        print("hyprctl hyprpaper wallpaper ',", filepath, ", [ ]'")
        print("couldnt set wallpaper, maybe daemon isn't running?: ", handler, filepath)

def applyWallpaper(id, handler: str, save_dir: str = None):
    filepath = downloadWallpaper(id, True, save_dir);
    if whichWallHandler(handler) is not 0:
        runHandler(handler, filepath)
    else:
        print(handler + "not aviable")