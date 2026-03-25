import { useEffect, useRef, useState } from "react"
import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"

export default function App(){

  const worker = useRef(null)

  const [commonResults,setCommonResults] = useState([])
  const [extraResults,setExtraResults] = useState([])

  const [trap3,setTrap3] = useState([])
  const [trap4,setTrap4] = useState([])

  const [best,setBest] = useState([])
  const [spammable,setSpammable] = useState([])

  const [bestMove,setBestMove] = useState(null)
  const [spamMove,setSpamMove] = useState(null)

  // 🔹 INIT WORKER
  useEffect(()=>{

    worker.current = new Worker(
      new URL("./worker/searchWorker.js",import.meta.url),
      {type:"module"}
    )

    worker.current.onmessage = e =>{

      const {
        resultsCommon,
        resultsExtra,
        traps3,
        traps4,
        best,
        spammable
      } = e.data

      setCommonResults(resultsCommon || [])
      setExtraResults(resultsExtra || [])

      setTrap3(traps3 || [])
      setTrap4(traps4 || [])

      setBest(best || [])
      setSpammable(spammable || [])

      // 🔥 PICK BEST PLAY WORD (not just trap)
      setBestMove(best?.[0]?.plays?.[0] || null)
      setSpamMove(spammable?.[0]?.plays?.[0] || null)

    }

    async function load(){

      const common = await fetch("/alphawords.txt").then(r=>r.text())
      const extra = await fetch("/extra_words.txt").then(r=>r.text())

      worker.current.postMessage({
        type:"LOAD_COMMON",
        payload: common.split("\n").map(w=>w.trim()).filter(Boolean)
      })

      worker.current.postMessage({
        type:"LOAD_EXTRA",
        payload: extra.split("\n").map(w=>w.trim()).filter(Boolean)
      })

    }

    load()

  },[])

  // 🔹 SEARCH
  function handleSearch(q){

    setBestMove(null)
    setSpamMove(null)

    worker.current.postMessage({
      type:"SEARCH",
      payload:q.toLowerCase()
    })

  }

  // 🔹 COPY HELPER
  function copy(text){
    navigator.clipboard.writeText(text)
  }

  return(

    <div className="app">

      <h1>Word Trap Solver</h1>

      {/* 🔥 TOP ACTION BAR */}
      <div className="quick-panel-top">

        {bestMove && (
          <button
            className="best-btn"
            onClick={()=>copy(bestMove)}
          >
            🧨 Best: {bestMove}
          </button>
        )}

        {spamMove && (
          <button
            className="spam-btn"
            onClick={()=>copy(spamMove)}
          >
            🔁 Spam: {spamMove}
          </button>
        )}

      </div>

      <SearchBar onSearch={handleSearch}/>

      {/* WORDS */}
      <h2>Common Words</h2>
      <WordList words={commonResults}/>

      {extraResults.length > 0 && (
        <>
          <h2>Uncommon Words</h2>
          <WordList words={extraResults}/>
        </>
      )}

      {/* TRAPS */}
      <TrapSection title="Best Traps" traps={best}/>
      <TrapSection title="Spammable Traps" traps={spammable}/>
      <TrapSection title="3 Letter Traps" traps={trap3}/>
      <TrapSection title="4 Letter Traps" traps={trap4}/>

    </div>

  )

}