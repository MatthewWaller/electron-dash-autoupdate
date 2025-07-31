const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let dashProcess;

// Configure auto-updater
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

  // Load the Dash app URL after a short delay to let it start
  setTimeout(() => {
    mainWindow.loadURL('http://127.0.0.1:8050');
  }, 3000);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (dashProcess) {
      dashProcess.kill();
    }
  });
}

function startDashApp() {
  // Path to the Python executable created by PyInstaller
  const pythonExe = path.join(__dirname, '..', 'dist', 'python', 'dash_app');
  
  // Set environment variables
  const env = { ...process.env, DASH_PORT: '8050' };
  
  // Start the Dash app process
  dashProcess = spawn(pythonExe, [], { env });
  
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
  console.log('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  autoUpdater.quitAndInstall();
});