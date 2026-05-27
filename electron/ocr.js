import screenshot from "screenshot-desktop"

import Tesseract from "tesseract.js"

let busy = false

export async function startOCR(win){

setInterval(async()=>{

if(busy) return

busy = true

try{

const img = await screenshot({
format:"png"
})

const result = await Tesseract.recognize(
img,
"eng"
)

const text = result.data.text
.toLowerCase()
.replace(/[^a-z]/g," ")

const words = text.match(/\b[a-z]{1,6}\b/g)

if(words && words.length){

const latest = words[words.length-1]

win.webContents.send(
"ocr-word",
latest
)

}

}catch(err){

console.log(err)

}

busy = false

},1200)

}