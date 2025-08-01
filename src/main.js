const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let dashProcess;

// Configure auto-updater - DIAGNOSTIC INFO
console.log('=== DIAGNOSTIC INFO ===');
console.log('App version:', app.getVersion());
console.log('App name:', app.getName());
console.log('Resources path:', process.resourcesPath);
console.log('Is packaged:', app.isPackaged);
console.log('Electron version:', process.versions.electron);
console.log('Platform:', process.platform);
console.log('======================');

// Clear any cached update info
autoUpdater.allowDowngrade = false;
autoUpdater.allowPrerelease = false;

// Add a delay to ensure the window is ready before checking
setTimeout(() => {
  console.log('Starting auto-updater check...');
  console.log('Update URL:', autoUpdater.getFeedURL());
  autoUpdater.checkForUpdatesAndNotify();
}, 2000);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Start the Dash app
  startDashApp();

  // Wait for Dash server to be ready before loading
  waitForDashServer();

  // Create application menu
  const template = [
    {
      label: 'App',
      submenu: [
        {
          label: 'Check for Updates',
          click: () => {
            console.log('Manual update check triggered from menu');
            logToRenderer('Manual update check triggered from menu');
            autoUpdater.checkForUpdatesAndNotify();
          }
        },
        {
          label: 'Force Update Check',
          click: () => {
            console.log('Force update check - clearing cache');
            logToRenderer('Force update check - clearing cache');
            autoUpdater.checkForUpdates();
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (dashProcess) {
      dashProcess.kill();
    }
  });
}

function startDashApp() {
  // In development, run Python directly. In production, use the PyInstaller executable
  const isDev = process.argv.includes('--dev');
  
  if (isDev) {
    // Development mode - run Python script directly
    dashProcess = spawn('python', ['dash_app.py'], { 
      env: { ...process.env, DASH_PORT: '8050' }
    });
  } else {
    // Production mode - use PyInstaller executable from extraResources
    const pythonExe = path.join(process.resourcesPath, 'python', 'dash_app');
    console.log('Looking for Python executable at:', pythonExe);
    dashProcess = spawn(pythonExe, [], { 
      env: { ...process.env, DASH_PORT: '8050' }
    });
  }
  
  dashProcess.stdout.on('data', (data) => {
    console.log(`Dash stdout: ${data}`);
  });
  
  dashProcess.stderr.on('data', (data) => {
    console.error(`Dash stderr: ${data}`);
  });
  
  dashProcess.on('close', (code) => {
    console.log(`Dash process exited with code ${code}`);
  });
}

function waitForDashServer() {
  const checkServer = () => {
    const req = http.get('http://127.0.0.1:8050', (res) => {
      console.log('Dash server is ready, loading URL...');
      mainWindow.loadURL('http://127.0.0.1:8050');
    });
    
    req.on('error', (err) => {
      console.log('Dash server not ready yet, retrying in 500ms...');
      setTimeout(checkServer, 500);
    });
  };
  
  // Start checking after a short delay
  setTimeout(checkServer, 1000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to safely log to renderer console
function logToRenderer(message, isError = false) {
  if (mainWindow && mainWindow.webContents) {
    const safeMessage = message.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const logFunction = isError ? 'console.error' : 'console.log';
    mainWindow.webContents.executeJavaScript(`${logFunction}("${safeMessage}")`);
  }
}

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  const message = 'Checking for update...';
  console.log(message);
  logToRenderer(message);
});

autoUpdater.on('update-available', (info) => {
  const message = `Update available: ${info.version}`;
  console.log(message);
  logToRenderer(message);
  // Automatically start downloading the update
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info) => {
  const message = `Update not available. Current version: ${info.version}`;
  console.log(message);
  logToRenderer(message);
});

autoUpdater.on('error', (err) => {
  const message = `Error in auto-updater: ${err.message || err}`;
  console.log(message);
  logToRenderer(message, true);
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${Math.round(progressObj.percent)}% (${progressObj.transferred}/${progressObj.total})`;
  console.log(message);
  logToRenderer(message);
});

autoUpdater.on('update-downloaded', (info) => {
  const message = `Update downloaded: ${info.version}. Restarting app...`;
  console.log(message);
  logToRenderer(message);
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 1000);
});