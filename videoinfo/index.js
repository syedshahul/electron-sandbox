const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
// const app = electron.app
//
// const BrowserWindow = electron.BrowserWindow
const {app, BrowserWindow, ipcMain} = electron

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('video:submit',(event, path)=>{
  console.log(path);
ffmpeg.ffprobe(path,(err, metadata) =>{
  // console.log("Video duration is: ",metadata.format.duration);
  mainWindow.webContents.send('video:metadata', metadata.format.duration);
});
});
