const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let dashProcess;

// Configure auto-updater
console.log('App version:', app.getVersion());
autoUpdater.checkForUpdatesAndNotify();

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

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available. Current version:', info.version);
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  autoUpdater.quitAndInstall();
});