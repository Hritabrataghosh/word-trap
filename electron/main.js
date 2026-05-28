import { app, BrowserWindow } from "electron"
import path from "path"

let win

function createWindow(){

  win = new BrowserWindow({

    width:1600,
    height:170,

    x:150,
    y:850,

    transparent:false,

    frame:false,

    alwaysOnTop:true,

    skipTaskbar:false,

    resizable:false,

    movable:true,

    focusable:true,

    hasShadow:false,

    backgroundColor:"#050b16",

    webPreferences:{

      preload:path.join(
        process.cwd(),
        "electron/preload.js"
      )

    }

  })

  win.loadURL("http://localhost:5173")

  win.setAlwaysOnTop(true,"screen-saver")

  win.on("blur",()=>{

    win.setAlwaysOnTop(true,"screen-saver")

    win.show()

    win.focus()

  })

}

app.whenReady().then(createWindow)