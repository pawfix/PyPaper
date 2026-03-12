#!/usr/bin/env fish

# Function to install system dependencies
function install_system_deps
    if test -f /etc/os-release
        source /etc/os-release
        switch $ID
            case arch
                echo "Detected Arch Linux. Installing dependencies..."
                sudo pacman -S --needed webkit2gtk python-gobject python
            case ubuntu debian
                echo "Detected $ID. Installing dependencies..."
                sudo apt update
                sudo apt install -y libwebkit2gtk-4.0-dev python3-gi python3 python3-pip
            case fedora
                echo "Detected Fedora. Installing dependencies..."
                sudo dnf install -y webkit2gtk3 python3-gobject python3 python3-pip
            case '*'
                echo "Unsupported distro: $ID. Please install dependencies manually: GTK, WebKitGTK, python3, pip, supported Terminal and supported Wallpaper Util"
        end
    else
        echo "Cannot detect distro. Please install dependencies manually."
    end
end

# Install system dependencies
install_system_deps

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate.fish

# Install Python dependencies
pip install -r requirements.txt

echo "Installation complete. Run 'source .venv/bin/activate.fish' to activate the environment."