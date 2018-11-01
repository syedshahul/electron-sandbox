const electron = require('electron');
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron;



let mainWindow;
let addWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL(`file://${__dirname}/main.html`)

  // To display Dev tools by default.
  //mainWindow.webContents.openDevTools()

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', function() {
    mainWindow = null;
    addWindow = null;
    app.quit();
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

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {

  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});
const menuTemplate = [{
  label: 'File',
  submenu: [{
      label: 'New Todo',
      click() {
        createAddWindow();
      }
    },
    {
      label:'Clear List',
      click(){
        mainWindow.webContents.send('todo:clearlist');        
      }
    },
    {
      label: 'Quit',
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]
}];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      {
        role:'reload'
      },
      {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  ]
  });
}
