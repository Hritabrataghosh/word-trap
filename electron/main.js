import { app,BrowserWindow } from "electron"

import path from "path"

import { fileURLToPath } from "url"

import { startOCR } from "./ocr.js"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

function createWindow(){

const win = new BrowserWindow({

width:420,
height:240,

transparent:true,

frame:false,

alwaysOnTop:true,

resizable:false,

skipTaskbar:true,

hasShadow:false,

backgroundColor:"#00000000",

webPreferences:{
preload:path.join(__dirname,"preload.js"),
contextIsolation:true
}

})

win.loadURL("http://localhost:5173")

startOCR(win)

}

app.whenReady().then(createWindow)