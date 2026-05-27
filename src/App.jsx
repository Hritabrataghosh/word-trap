import { useEffect, useRef, useState } from "react"

import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"
import SpamSection from "./components/SpamSection"

export default function App(){

const worker = useRef(null)

const [mode,setMode] = useState("normal")

const [results,setResults] = useState([])

const [traps3,setTraps3] = useState([])
const [traps4,setTraps4] = useState([])

const [spamChains,setSpamChains] = useState([])

const [ocrWord,setOCRWord] = useState("")

useEffect(()=>{

worker.current = new Worker(
new URL("./worker/searchWorker.js",import.meta.url),
{type:"module"}
)

worker.current.onmessage = e =>{

const {
results,
traps3,
traps4,
spamChains
} = e.data

setResults(results || [])

setTraps3(traps3 || [])
setTraps4(traps4 || [])

setSpamChains(spamChains || [])

}

async function loadWords(){

const text = await fetch("/alphawords.txt")
.then(r=>r.text())

const words = text
.split("\n")
.map(w=>w.trim().toLowerCase())
.filter(w=>w.length >= 3)

worker.current.postMessage({
type:"LOAD",
payload:words
})

}

loadWords()

},[])

useEffect(()=>{

if(window.electronAPI){

window.electronAPI.onOCR(word=>{

if(!word) return

setOCRWord(word)

handleSearch(word)

})

}

},[])

function handleSearch(q){

if(!worker.current) return

worker.current.postMessage({

type:"SEARCH",

payload:{
query:q.toLowerCase(),
mode
}

})

}

return(

<div className="app overlay-mode">

<h1 className="title">
Word Trap Solver
</h1>

<div className="mode-switch">

<button
className={mode==="normal" ? "active" : ""}
onClick={()=>setMode("normal")}
>
Normal
</button>

<button
className={mode==="spam" ? "active" : ""}
onClick={()=>setMode("spam")}
>
Spam
</button>

</div>

<SearchBar
onSearch={handleSearch}
/>

{ocrWord && (

<div className="ocr-live">

LIVE:
<span>{ocrWord}</span>

</div>

)}

<div className="compact-area">

<div className="compact-block">

<h2>
Words
</h2>

<WordList words={results}/>

</div>

{mode==="normal" && (

<>

<div className="compact-block">

<h2>
3 Letter Traps
</h2>

<TrapSection traps={traps3}/>

</div>

<div className="compact-block">

<h2>
4 Letter Traps
</h2>

<TrapSection traps={traps4}/>

</div>

</>

)}

{mode==="spam" && (

<div className="compact-block">

<h2>
Spammable Chains
</h2>

<SpamSection chains={spamChains}/>

</div>

)}

</div>

</div>

)

}