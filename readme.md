# PyPaper

A small Python utility for downloading and applying wallpapers programmatically.

![GitHub stars](https://img.shields.io/github/stars/pawfix/PyPaper?style=flat)
![GitHub license](https://img.shields.io/github/license/pawfix/PyPaper)
![Python](https://img.shields.io/badge/python-3.x-blue)
![GitHub issues](https://img.shields.io/github/issues/pawfix/PyPaper)
![GitHub last commit](https://img.shields.io/github/last-commit/pawfix/PyPaper)
![Repo size](https://img.shields.io/github/repo-size/pawfix/PyPaper)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Install from source](#install-from-source)
  - [Platform notes](#platform-notes)
- [Usage](#usage)
  - [GUI](#gui)
  - [CLI](#cli)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PyPaper is a lightweight Python tool that fetches wallpapers from remote sources, stores them locally, and applies them using a system-specific wallpaper handler. It is intended for use in scripts, automation tasks, or as the backend for simple GUI utilities.

The project emphasizes a small footprint, minimal dependencies, and ease of extension.

### Use cases

- Automation scripts and cron jobs
- Desktop customization setups
- Integration with window managers
- Programmatic wallpaper rotation
- Building custom wallpaper workflows

---

## Features

- Download wallpapers programmatically
- Optional saving to a custom directory
- Automatic wallpaper application
- Pluggable handler architecture
- Simple CLI and optional GUI
- Minimal dependencies (standard library + a few extras)
- Primarily designed for Linux

---

### Requirements

- Python 3.8 or newer
- A supported wallpaper handler installed and available on `PATH`:
  - **Linux**: `swww`, `awww`, `hyprpaper`, etc. (these are the only handlers currently implemented)
- (Optional) `pywebview` if you want the GUI interface

### Install from source

```bash
git clone https://github.com/pawfix/PyPaper.git
cd PyPaper
python -m venv .venv
# activate the environment:
#   source .venv/bin/activate    (Linux/macOS)
#   .venv\Scripts\Activate.ps1 (Windows PowerShell)
pip install -r requirements.txt
```

Once set up, run the application:

```bash
python main.py
```

Windows users can also invoke `scripts/install.bat` to create and activate the virtual environment automatically.

### Platform notes

- **Linux**: tested primarily on X11/Wayland desktops.
- **Windows**: uses PowerShell or `nircmd` to change the wallpaper.
- **macOS**: relies on `osascript` to update the desktop picture.

The handler selection logic in `wallpaper.py` detects available commands or can be overridden via environment variables.

---

## Usage

### GUI

If `pywebview` is installed, launch the graphical interface:

```bash
python main.py
```

A simple window will appear letting you download and apply wallpapers interactively.

### CLI

```
# request download (-d) and optionally switch to CLI mode (-c)
python main.py -d -c            # search, download and apply via CLI
# or equivalently python main.py -cd (short options can be grouped)

python main.py --save-dir PATH  # specify save directory
python main.py --handler name   # force a particular handler (used when applying)
python main.py --help           # show available options
```
All options are documented in the help message.

### Configuration

No configuration file is required. You can influence behavior via:

- `PYPAPER_DIR` – default wallpaper save directory
- `PYPAPER_HANDLER` – explicit wallpaper handler command

For advanced use, subclass `wallpaper.Handler` in your own Python scripts to add support for custom environments.

---

## Project Structure

```
PyPaper/
├── api.py           # Contact with wallhaven Api
├── main.py          # entry point and CLI parser
├── gui.py           # webview GUI implementation
├── wallpaper.py     # handler detection and execution
├── local.py         # configuration helpers
├── utils.py         # miscellaneous utilities
├── requirements.txt
├── readme.md        # this file
├── LICENSE
├── scripts/         # helper install scripts
├── spec/            # pyinstaller spec files
└── site/            # example web assets
```

The structure may evolve as features are added.

---

## Development

To work on the project locally:

1. Fork the repository and clone it.
2. Create and activate a virtual environment (see installation above).
3. Install the dependencies: `pip install -r requirements.txt`.
4. Run `python main.py` to exercise the CLI or GUI.

Add tests alongside new features when possible and keep code style consistent.

---

## Contributing

Contributions are very welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes with clear, descriptive commit messages.
4. Push your branch and open a pull request.

Issues, suggestions, and bug reports are appreciated—feel free to open them on GitHub.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


- provider plugins
- caching system
- better handler detection
- image metadata support

---

# Contributing

Contributions are welcome.

Basic workflow:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes
4. Push the branch
5. Open a Pull Request

Suggestions, bug reports, and improvements are always appreciated.

---

# License

This project is licensed under the MIT License.

See the `LICENSE` file for details.
