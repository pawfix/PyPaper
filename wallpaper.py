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
                subprocess.run(["swww", "img", filepath], check=True);

            case 'awww':
                subprocess.run(["awww", "img", filepath], check=True);

            case 'hyprpaper':
                subprocess.run([
                    "hyprctl",
                    "hyprpaper",
                    "wallpaper",
                    f", {filepath} , [ ]"
                ], check=True);

            case 'wpaperd':
                subprocess.run(["wpaperdctl", "set", filepath], check=True);
            
            case 'swaybg':
                subprocess.run(["swaybg", "-i", filepath], check=True);
            
            case _:
                raise Exception(f"Handler '{handler}' not supported")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to set wallpaper with handler '{handler}': {e}")
    except FileNotFoundError:
        raise Exception(f"Handler '{handler}' not found. Make sure it's installed and in PATH.")
    except Exception as e:
        raise Exception(f"Error setting wallpaper with handler '{handler}': {e}")

def applyWallpaper(id, handler: str, save_dir: str = None):
    try:
        filepath = downloadWallpaper(id, True, save_dir);
        if not filepath:
            raise Exception("Failed to download wallpaper")
        
        if whichWallHandler(handler) == 0:
            raise Exception(f"Handler '{handler}' is not available. Make sure it's installed.")
        
        runHandler(handler, filepath)
    except Exception as e:
        raise Exception(f"Failed to apply wallpaper: {e}")