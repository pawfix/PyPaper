#!/usr/bin/env fish

function install_system_deps
    if test -f /etc/os-release
        set distro (grep '^ID=' /etc/os-release | string replace 'ID=' '' | string trim -c '"')

        switch $distro
            case arch
                echo "Detected Arch Linux. Installing dependencies..."
                sudo pacman -S --needed webkit2gtk python-gobject swww viu kitty python

            case ubuntu debian
                echo "Detected $distro. Installing dependencies..."
                sudo apt update
                sudo apt install -y libwebkit2gtk-4.0-dev python3-gi swww viu kitty python3 python3-pip

            case fedora
                echo "Detected Fedora. Installing dependencies..."
                sudo dnf install -y webkit2gtk3 python3-gobject swww viu kitty python3 python3-pip

            case '*'
                echo "Unsupported distro: $distro. Please install dependencies manually: GTK, WebKitGTK, swww, viu, kitty, python3, pip"
        end
    else
        echo "Cannot detect distro. Please install dependencies manually."
    end
end

install_system_deps

python3 -m venv .venv

source .venv/bin/activate.fish

pip install -r requirements.txt

source .venv/bin/activate.fish

echo "Activated VENV"

Run build.sh or run main.py
