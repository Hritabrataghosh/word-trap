import { useEffect, useRef, useState } from "react"
import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"

export default function App() {

  const workerRef = useRef(null)

  const [results, setResults] = useState([])
  const [trap2, setTrap2] = useState([])
  const [trap3, setTrap3] = useState([])
  const [trap4, setTrap4] = useState([])

  useEffect(() => {

    workerRef.current = new Worker(
      new URL("./worker/searchWorker.js", import.meta.url),
      { type: "module" }
    )

    workerRef.current.onmessage = e => {
      const { results, trap2, trap3, trap4 } = e.data

      setResults(results)
      setTrap2(trap2)
      setTrap3(trap3)
      setTrap4(trap4)
    }

    fetch("/words.txt")
      .then(r => r.text())
      .then(text => {
        const words = text.split("\n").map(w => w.trim()).filter(Boolean)

        workerRef.current.postMessage({
          type: "LOAD",
          payload: words
        })
      })

  }, [])

  function handleSearch(query) {
    workerRef.current.postMessage({
      type: "SEARCH",
      payload: query
    })
  }

  return (
    <div className="app">

      <h1>Word Trap Solver</h1>

      <SearchBar onSearch={handleSearch} />

      <WordList words={results} />

      <TrapSection title="2 Letter Traps" traps={trap2} />
      <TrapSection title="3 Letter Traps" traps={trap3} />
      <TrapSection title="4 Letter Traps" traps={trap4} />

    </div>
  )
}