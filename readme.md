# PyPaper

A small Python utility for downloading and applying wallpapers programmatically.

![GitHub stars](https://img.shields.io/github/stars/pawfix/PyPaper?style=flat)
![GitHub license](https://img.shields.io/github/license/pawfix/PyPaper)
![Python](https://img.shields.io/badge/python-3.x-blue)
![GitHub issues](https://img.shields.io/github/issues/pawfix/PyPaper)
![GitHub last commit](https://img.shields.io/github/last-commit/pawfix/PyPaper)
![Repo size](https://img.shields.io/github/repo-size/pawfix/PyPaper)

---

# Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Install from source](#install-from-source)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

# Overview

PyPaper is a lightweight Python tool for working with wallpapers programmatically.

It focuses on a simple workflow:

1. Fetch or download wallpapers
2. Store them locally
3. Apply them using a system wallpaper handler

The project exists mainly as a scripting-friendly alternative to GUI wallpaper managers. It allows developers to integrate wallpaper downloading and switching directly into Python scripts, CLI tools, or automation setups.

Typical use cases include:

- automation scripts
- desktop customization setups
- integration with tiling window managers
- programmatic wallpaper switching
- building custom wallpaper tools

The codebase is intentionally small and easy to extend.

---

# Features

- Download wallpapers programmatically
- Optional saving to a custom directory
- Automatic wallpaper application
- Support for external wallpaper handlers
- Simple Python API
- Script-friendly design
- Minimal dependencies
- Designed for Linux desktop environments

---

# Installation

## Requirements

- Python 3.8+
- Linux (tested primarily on Linux desktop environments)
- A supported wallpaper handler such as:

```
swww
awww
hyprpaper
```

---

## Install from source

Clone the repository:

```bash
git clone https://github.com/pawfix/PyPaper
cd PyPaper
```

Install dependencies:

Install PyWebView deps for your distro

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Or run one of scripts

Run the tool:

```bash
python main.py
```

---

# Usage

## Download a wallpaper

Run the GUI:

``` bash
python main.py
```

Or CLI:
``` bash
python main.py -cd
```

# Project Structure

```
PyPaper/
│
├── main.py
├── wallpaper.py
├── utils.py
├── requirements.txt
└── README.md
```

### Key Components

**main.py**

Entry point for wallpaper downloading logic.

Responsible for:

- retrieving wallpapers
- saving them locally
- returning file paths

---

**wallpaper.py**

Handles applying wallpapers using system commands.

Functions include:

- handler detection
- command execution
- wallpaper switching

---


# Development

To work on the project locally:

```bash
git clone https://github.com/pawfix/PyPaper
cd PyPaper
```

Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the project:

```bash
python main.py
```

---

# Roadmap

Planned improvements:

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
