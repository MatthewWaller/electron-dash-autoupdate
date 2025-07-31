# Claude Assistant Context

## Project Overview
This is an Electron app that embeds a Dash Python application with auto-update functionality. The Dash app displays a simple "Hello there" message when a button is pressed.

## Architecture
- **Electron**: Main desktop application framework
- **Dash**: Python web framework for the embedded app
- **PyInstaller**: Packages the Python Dash app as a standalone executable
- **electron-updater**: Handles automatic updates from GitHub releases

## Key Files
- `src/main.js`: Electron main process
- `src/renderer.js`: Electron renderer process
- `dash_app.py`: Python Dash application
- `dash_app.spec`: PyInstaller configuration
- `.github/workflows/build.yml`: GitHub Actions for automated builds

## Development Commands
- `npm run dev`: Start in development mode
- `npm run build-python`: Build Python app with PyInstaller
- `npm run build`: Build Electron app
- `npm run dist`: Create distribution packages

## Build Process
1. Python app is built with PyInstaller into `dist/python/`
2. Electron app includes the Python executable
3. GitHub Actions automatically builds and releases updates

## Auto-Update Flow
1. App checks GitHub releases for new versions on startup
2. Downloads and installs updates automatically
3. Restarts to apply updates

## Target Platform
- macOS ARM64 (M-series processors)

## Notes
- Python executable is bundled with the Electron app
- Updates are distributed via GitHub releases
- Version changes in the Dash app trigger auto-updates