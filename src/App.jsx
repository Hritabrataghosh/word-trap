import { useEffect,useRef,useState } from "react"
import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"

export default function App(){

const worker = useRef(null)

const [mode,setMode] = useState("normal")

const [commonResults,setCommonResults] = useState([])
const [extraResults,setExtraResults] = useState([])

const [trap3,setTrap3] = useState([])
const [trap4,setTrap4] = useState([])

const [best,setBest] = useState([])
const [spammable,setSpammable] = useState([])

useEffect(()=>{

worker.current = new Worker(
new URL("./worker/searchWorker.js",import.meta.url),
{type:"module"}
)

worker.current.onmessage = e=>{

const {
resultsCommon,
resultsExtra,
traps3,
traps4,
best,
spammable
} = e.data

setCommonResults(resultsCommon||[])
setExtraResults(resultsExtra||[])

setTrap3(traps3||[])
setTrap4(traps4||[])

setBest(best||[])
setSpammable(spammable||[])

}

async function load(){

const common =
await fetch("/alphawords.txt")
.then(r=>r.text())

const extra =
await fetch("/extra_words.txt")
.then(r=>r.text())

worker.current.postMessage({
type:"LOAD_COMMON",
payload:common.split("\n")
})

worker.current.postMessage({
type:"LOAD_EXTRA",
payload:extra.split("\n")
})

}

load()

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
>
Normal
</button>

<button
onClick={()=>setMode("spam")}
>
Spam
</button>

</div>

<SearchBar onSearch={handleSearch}/>

<h2>Common Words</h2>
<WordList words={commonResults}/>

{extraResults.length>0 && (
<>
<h2>Uncommon Words</h2>
<WordList words={extraResults}/>
</>
)}

{mode==="normal" && (
<>

<TrapSection
title="Best Traps"
traps={best}
/>

<TrapSection
title="3 Letter Traps"
traps={trap3}
/>

<TrapSection
title="4 Letter Traps"
traps={trap4}
/>

</>
)}

{mode==="spam" && (

<TrapSection
title="Spammable Chains"
traps={spammable}
/>

)}

</div>

)

}