import os
import json
import base64


def getLocalFiles(fileDir):
    fileDir = os.path.expanduser(fileDir)

    # List files (non-recursive)
    try:
        filenames = next(os.walk(fileDir))[2]
    except StopIteration:
        filenames = []

    # Filter PNGs starting with 'wallhaven'
    src_files = [
        f for f in filenames
        if f.lower().startswith("wallhaven") and f.lower().endswith(".png")
    ]

    if not src_files:
        return json.dumps({"id": [[], []]}, indent=4)

    names = [f[len("wallhaven-"):-len(".png")] for f in src_files]

    src_base64 = []
    for f in src_files:
        path = os.path.join(fileDir, f)
        with open(path, "rb") as img_file:
            encoded = base64.b64encode(img_file.read()).decode("utf-8")
            src_base64.append(encoded)

    # **Important:** return both base64 and absolute path
    dirJson = json.dumps(
        {
            "id": [
                [{"name": n} for n in names],
                [{"src": f"data:image/png;base64,{s}", "filePath": os.path.abspath(os.path.join(fileDir, f))} 
                 for s, f in zip(src_base64, src_files)]
            ]
        },
        indent=4
    )

    return dirJson
