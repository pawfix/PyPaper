# PyPaper

A lightweight Python wallpaper manager with a simple API and desktop UI.

## Overview

PyPaper is a small utility for browsing, downloading, and applying wallpapers directly from Python.  
It was originally built as a personal project to simplify wallpaper management on Linux systems, especially in environments where standard desktop tools don’t work well (tiling WMs, minimal setups, etc.).

The project combines a small Python backend with a lightweight UI layer to fetch wallpapers, preview them, download them locally, and apply them using system wallpaper handlers.

The goal of PyPaper is to stay simple, hackable, and easy to extend.

## Features

- Fetch wallpaper metadata from a remote source
- Download wallpapers locally
- Apply wallpapers through configurable handlers
- Simple API interface for UI → backend communication
- Lightweight desktop interface built with `pywebview`
- Custom wallpaper save directory
- Runtime wallpaper application via system commands
- Basic handler detection (checks if a wallpaper backend exists)
- Modular Python structure designed to be easy to modify

## Screenshots / Demo

*(Add screenshots here once available)*

Examples could include:

- Wallpaper browsing interface
- Downloaded wallpaper preview
- Applying wallpaper through the UI

## Installation

### Requirements

- Python 3.10+
- A wallpaper backend installed on your system (example: `swww`, `feh`, etc.)

### Clone the repository

```bash
git clone https://github.com/pawfix/PyPaper.git
cd PyPaper
````

### Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

If the project uses `pyproject.toml`:

```bash
pip install .
```

## Usage

Run the main application:

```bash
python main.py
```

This will launch the PyPaper UI.

### Example: Applying a wallpaper programmatically

```python
from main import applyWallpaper

applyWallpaper(
    id="wallpaper_id",
    handler="swww",
    save_dir="~/Pictures/wallpapers"
)
```

### Example: Downloading a wallpaper

```python
from main import downloadWallpaper

downloadWallpaper("wallpaper_id")
```

## Configuration

Some behavior can be controlled through parameters in the API functions.

### Wallpaper handler

The handler is the program responsible for actually setting the wallpaper.

Examples:

```
swww
feh
nitrogen
```

Example call:

```python
applyWallpaper("12345", "swww")
```

### Save directory

You can optionally specify where downloaded wallpapers should be stored:

```python
applyWallpaper("12345", "swww", "~/Pictures/wallpapers")
```

If not provided, PyPaper will use its default storage location.

## Project Structure

```
PyPaper/
├── main.py              # Entry point for the application
├── api/                 # Backend API used by the UI
├── ui/                  # Frontend assets used by pywebview
├── utils/               # Helper utilities
├── assets/              # Static files
├── requirements.txt     # Python dependencies
└── README.md

*(structure may evolve as the project grows)*

## Dependencies

Main libraries used:

* `pywebview` – lightweight UI layer
* `requests` – downloading wallpaper data
* `json` – API data handling
* `subprocess` – executing wallpaper handlers
* `shutil` – handler detection

System dependencies depend on your wallpaper backend (for example `swww`).

## Development

To run PyPaper in development mode:

```bash
git clone https://github.com/pawfix/PyPaper.git
cd PyPaper
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Packaging (optional)

If you want to build a standalone binary:

```bash
pyinstaller PyPaper.spec
```

## Roadmap

Potential improvements planned for the project:

* Wallpaper source plugins
* Local wallpaper collections
* Wallpaper history
* Automatic wallpaper rotation
* Multi-monitor support
* Better UI browsing experience
* Cross-platform support

## Contributing

Contributions are welcome.

If you'd like to help:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

Bug reports, feature suggestions, and improvements are always appreciated.

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

```
::contentReference[oaicite:0]{index=0}
```

