# Electron Dash Auto-Update Demo

A demonstration of auto-updating Electron applications with embedded Python Dash apps.

## Features

- Electron desktop application
- Embedded Python Dash web application
- Automatic updates via GitHub releases
- Cross-platform support (currently configured for macOS ARM64)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MatthewWaller/electron-dash-autoupdate.git
cd electron-dash-autoupdate
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install dash pyinstaller
```

### Development

1. Build the Python application:
```bash
npm run build-python
```

2. Start the Electron app:
```bash
npm run dev
```

### Building for Distribution

1. Build the Python app:
```bash
npm run build-python
```

2. Build the Electron app:
```bash
npm run dist
```

## How It Works

1. **Dash App**: A simple Python web application with a button that displays "Hello there"
2. **PyInstaller**: Packages the Python app as a standalone executable
3. **Electron**: Wraps the Python app in a desktop application
4. **Auto-Updates**: Uses `electron-updater` to check for and install updates from GitHub releases

## Auto-Update Process

1. The app checks for updates on startup
2. If a new version is found on GitHub releases, it downloads automatically
3. The app restarts to apply the update
4. Users always have the latest version

## Project Structure

```
electron-dash-autoupdate/
├── src/
│   ├── main.js          # Electron main process
│   └── renderer.js      # Electron renderer process
├── dist/
│   └── python/          # Built Python executable
├── dash_app.py          # Python Dash application
├── dash_app.spec        # PyInstaller configuration
├── package.json         # Node.js configuration
└── .github/
    └── workflows/
        └── build.yml     # Automated build process
```

## Customization

To change the message displayed by the Dash app:

1. Edit `dash_app.py`
2. Commit and push to GitHub
3. The GitHub Action will automatically build and release a new version
4. Installed apps will auto-update to show the new message

## License

MIT