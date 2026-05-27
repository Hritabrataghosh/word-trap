import { contextBridge,ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI",{

onOCR:(callback)=>{

ipcRenderer.on("ocr-word",(e,word)=>{

callback(word)

})

}

})