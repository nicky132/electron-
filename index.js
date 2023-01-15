const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
//主进程可以使用nodejs
const path = require('path');
const fs = require('fs');
const url = path.resolve('test', 'test');
console.log(fs.existsSync(url));

//窗口加载完后执行,初始化弹窗
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 1200,
    frame: false, //default:ture
    resizable: true, //规定窗口是否可以改变大小
    maxWidth: 1400,
    maxHeight: 960,
    minWidth: 500,
    minHeight: 400,
    show: false,//设置窗口是否显示
    webPreferences: {
      nodeIntegration: true, //是否开启node
      contextIsolation: false //是否开启上下文隔离

    }

  });
  /**
   * 可以加载本地文件，可与使用相对路径，也可以使用绝对路径
   * 可以加载非项目文件 不仅可以加载html文件，也可以加载其他格式文件
   * 可以加载远程文件
   */
  mainWindow.loadFile('index.html');

  mainWindow.setPosition(50, 100);
  //建立托盘
  const tray = new Tray('./image/icon.png')
  tray.setToolTip('nicky')
  //设置托盘菜单
  const menu = Menu.buildFromTemplate([{
    label: "退出",
    click: function (menuItem) {
      console.log('退出', menuItem)
      mainWindow.close();
    }
  }, {
    label: "设置",
    click: function (menuItem) {
      console.log('关于', menuItem)
    }
  }]
  )
  tray.setContextMenu(menu);
  //页面显示完在展示窗口，避免白屏，提高用户体验感
  mainWindow.once('ready-to-show', function () {
    mainWindow.show();
    // 打开控制台
    mainWindow.webContents.openDevTools();
  })
  mainWindow.on('show', function () {
    //mainWindow.maximize();//最大化
    mainWindow.minimize();//最小化
  });
  //主进程监听渲染进程方法
  ipcMain.on('renderer-send-data', (event, data) => {
    console.log(data);
    event.reply('main-send-reply', '我收到了');
  });
  console.log("whenReady", app.requestSingleInstanceLock());
});




/**
 * 生命周期
 * ready 应用程序初始化完成
 * browser-window-created 窗口创建完成触发
 * before-quit 窗口关闭之前
 * will-quit 窗口关闭了，但是程序没有关闭，即将关闭
 * quit 应用程序关闭触发
 * whenReady() then() 窗口加载完后执行
 * requestSingleInstanceLock() //限制程序只能启动一个程序
 * second-instance事件
 *
 */


//  app.on('ready', function () {
//   console.log('ready')
// })
// app.on('browser-window-created', function () {
//   console.log('browser-window-created')
// })
// app.on('before-quit', function () {
//   console.log('before-quit')
// })
// app.on('will-quit', function () {
//   console.log('will-quit')
// })
// app.on('quit', function () {
//   console.log('quit')
// })