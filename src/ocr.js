import Tesseract from "tesseract.js"

export async function recognizeText(image){

const result = await Tesseract.recognize(
image,
"eng"
)

return result.data.text

}