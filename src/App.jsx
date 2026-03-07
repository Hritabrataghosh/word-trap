import { useEffect, useRef, useState } from "react"
import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"

export default function App(){

const worker = useRef(null)

const [commonResults,setCommonResults] = useState([])
const [extraResults,setExtraResults] = useState([])

const [trap2,setTrap2] = useState([])
const [trap3,setTrap3] = useState([])
const [trap4,setTrap4] = useState([])
const [best,setBest] = useState([])

useEffect(()=>{

worker.current = new Worker(
new URL("./worker/searchWorker.js",import.meta.url),
{type:"module"}
)

worker.current.onmessage = e =>{

const {
resultsCommon,
resultsExtra,
traps2,
traps3,
traps4,
best
} = e.data

setCommonResults(resultsCommon || [])
setExtraResults(resultsExtra || [])

setTrap2(traps2 || [])
setTrap3(traps3 || [])
setTrap4(traps4 || [])

setBest(best || [])

}

async function loadDictionaries(){

const commonText = await fetch("/alphawords.txt").then(r=>r.text())

const commonWords = commonText
.split("\n")
.map(w=>w.trim())
.filter(Boolean)

worker.current.postMessage({
type:"LOAD_COMMON",
payload:commonWords
})

const extraText = await fetch("/extra_words.txt").then(r=>r.text())

const extraWords = extraText
.split("\n")
.map(w=>w.trim())
.filter(Boolean)

worker.current.postMessage({
type:"LOAD_EXTRA",
payload:extraWords)

}

loadDictionaries()

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

<SearchBar onSearch={handleSearch}/>

<h2>Common Words</h2>
<WordList words={commonResults}/>

{extraResults.length > 0 && (
<>
<h2>Uncommon Words</h2>
<WordList words={extraResults}/>
</>
)}

<TrapSection title="Best Traps" traps={best}/>
<TrapSection title="2 Letter Traps" traps={trap2}/>
<TrapSection title="3 Letter Traps" traps={trap3}/>
<TrapSection title="4 Letter Traps" traps={trap4}/>

</div>

)

}