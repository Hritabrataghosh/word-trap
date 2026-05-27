import { useEffect, useRef, useState } from "react"

import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"
import SpamSection from "./components/SpamSection"

export default function App(){

const worker = useRef(null)

const [results,setResults] = useState([])

const [best,setBest] = useState([])
const [traps3,setTraps3] = useState([])
const [traps4,setTraps4] = useState([])

const [spam,setSpam] = useState([])

useEffect(()=>{

worker.current = new Worker(
new URL("./worker/searchWorker.js",import.meta.url),
{type:"module"}
)

worker.current.onmessage = e =>{

const {
results,
best,
traps3,
traps4,
spam
} = e.data

setResults(results || [])

setBest(best || [])
setTraps3(traps3 || [])
setTraps4(traps4 || [])

setSpam(spam || [])

}

fetch("/alphawords.txt")
.then(r=>r.text())
.then(text=>{

const words = text
.split("\n")
.map(w=>w.trim().toLowerCase())
.filter(w=>w.length >= 3)

worker.current.postMessage({
type:"LOAD_WORDS",
payload:words
})

})

return ()=>{

if(worker.current){
worker.current.terminate()
}

}

},[])

function handleSearch(q){

if(!worker.current) return

worker.current.postMessage({
type:"SEARCH",
payload:q.toLowerCase()
})

}

return(

<div className="app">

<h1>Word Trap Solver</h1>

<SearchBar onSearch={handleSearch}/>

<h2>Words</h2>

<WordList words={results}/>

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

<SpamSection spam={spam}/>

</div>

)

}