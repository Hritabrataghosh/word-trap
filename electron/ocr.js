import screenshot from "screenshot-desktop"
import Tesseract from "tesseract.js"
import sharp from "sharp"

let busy = false
let lastLetters = ""

export async function startOCR(win){

  setInterval(async()=>{

    if(busy) return

    busy = true

    try{

      const img = await screenshot({

        format:"png",
        screen:0

      })

      const cropped = await sharp(img)

        .extract({

          left:650,
          top:70,

          width:620,
          height:230

        })

        .grayscale()

        .normalize()

        .sharpen()

        .threshold(155)

        .toBuffer()

      const result = await Tesseract.recognize(

        cropped,
        "eng",

        {

          logger:()=>{}

        }

      )

      let text = result.data.text

        .toLowerCase()

        .replace(/[^a-z]/g,"")

        .trim()

      if(text.length > 4){

        text = text.slice(0,4)

      }

      if(text.length < 1){

        busy = false
        return

      }

      if(text !== lastLetters){

        lastLetters = text

        console.log("OCR LETTERS:",text)

        win.webContents.send(

          "ocr-word",
          text

        )

      }

    }catch(err){

      console.log(err)

    }

    busy = false

  },700)

}