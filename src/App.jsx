import { useEffect, useRef, useState } from "react"

import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"
import SpamSection from "./components/SpamSection"

export default function App(){

const worker = useRef(null)

const [results,setResults] = useState([])

const [traps3,setTraps3] = useState([])
const [traps4,setTraps4] = useState([])
const [best,setBest] = useState([])

const [spam,setSpam] = useState([])

const [mode,setMode] = useState("normal")

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
best,
spam
} = e.data

setResults(results || [])

setTraps3(traps3 || [])
setTraps4(traps4 || [])
setBest(best || [])

setSpam(spam || [])

}

fetch("/alphawords.txt")
.then(r=>r.text())
.then(text=>{

const words = text
.split("\n")
.map(w=>w.trim())
.filter(Boolean)

worker.current.postMessage({
type:"LOAD_WORDS",
payload:words
})

})

},[])

function handleSearch(q){

worker.current.postMessage({
type:"SEARCH",
payload:q.toLowerCase()
})

}

return(

<div className="app">

<h1>Word Trap Solver</h1>

<div className="mode-buttons">

<button
onClick={()=>setMode("normal")}
className={mode==="normal" ? "active" : ""}
>
Normal
</button>

<button
onClick={()=>setMode("spam")}
className={mode==="spam" ? "active" : ""}
>
Spam
</button>

</div>

<SearchBar onSearch={handleSearch}/>

<h2>Words</h2>

<WordList words={results}/>

{mode==="normal" && (

<>

<TrapSection
title="Best Traps"
traps={best}
/>

<TrapSection
title="3 Letter Traps"
traps={traps3}
/>

<TrapSection
title="4 Letter Traps"
traps={traps4}
/>

</>

)}

{mode==="spam" && (

<SpamSection spam={spam}/>

)}

</div>

)

}