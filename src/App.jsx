import { useEffect, useRef, useState } from "react"

import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"
import SpamSection from "./components/SpamSection"

export default function App(){

  const worker = useRef(null)

  const [results,setResults] = useState([])

  const [trap3,setTrap3] = useState([])
  const [trap4,setTrap4] = useState([])

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
        spam
      } = e.data

      setResults(results || [])

      setTrap3(traps3 || [])
      setTrap4(traps4 || [])

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

      <SearchBar onSearch={handleSearch}/>

      <WordList words={results}/>

      {mode==="normal" && (

        <div className="compact-traps">

          <TrapSection
            title="3 Letter Traps"
            traps={trap3}
            compact={true}
          />

          <TrapSection
            title="4 Letter Traps"
            traps={trap4}
            compact={true}
          />

        </div>

      )}

      {mode==="spam" && (

        <SpamSection spam={spam}/>

      )}

    </div>

  )

}