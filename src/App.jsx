import {useEffect,useRef,useState} from "react"
import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"

export default function App(){

const worker = useRef(null)

const [results,setResults] = useState([])

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

const {results,trap2,trap3,trap4,best} = e.data

setResults(results)

setTrap2(trap2)
setTrap3(trap3)
setTrap4(trap4)

setBest(best)

}

fetch("/words.txt")
.then(r=>r.text())
.then(text=>{

const words = text.split("\n")
.map(w=>w.trim())
.filter(Boolean)

worker.current.postMessage({
type:"LOAD",
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

<SearchBar onSearch={handleSearch}/>

<WordList words={results}/>

<TrapSection title="Best Traps" traps={best}/>
<TrapSection title="2 Letter Traps" traps={trap2}/>
<TrapSection title="3 Letter Traps" traps={trap3}/>
<TrapSection title="4 Letter Traps" traps={trap4}/>

</div>

)

}