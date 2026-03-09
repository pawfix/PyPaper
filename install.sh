#!/bin/bash

# Function to install system dependencies
install_system_deps() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            case $ID in
                arch)
                    echo "Detected Arch Linux. Installing dependencies..."
                    sudo pacman -S --needed webkit2gtk python-gobject swww viu kitty python
                    ;;
                ubuntu|debian)
                    echo "Detected $ID. Installing dependencies..."
                    sudo apt update
                    sudo apt install -y libwebkit2gtk-4.0-dev python3-gi swww viu kitty python3 python3-pip
                    ;;
                fedora)
                    echo "Detected Fedora. Installing dependencies..."
                    sudo dnf install -y webkit2gtk3 python3-gobject swww viu kitty python3 python3-pip
                    ;;
                *)
                    echo "Unsupported distro: $ID. Please install dependencies manually: GTK, WebKitGTK, swww, viu, kitty, python3, pip"
                    ;;
            esac
        else
            echo "Cannot detect distro. Please install dependencies manually."
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Detected macOS. Installing dependencies..."
        # macOS might need brew
        if command -v brew &> /dev/null; then
            brew install python3 gtk+3 webkit2gtk swww viu kitty
        else
            echo "Homebrew not found. Please install Homebrew and dependencies manually."
        fi
    else
        echo "Unsupported OS: $OSTYPE. Please install dependencies manually."
    fi
}

# Install system dependencies
install_system_deps

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo "Installation complete. Run 'source .venv/bin/activate' to activate the environment."
