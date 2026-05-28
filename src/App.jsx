import { useMemo, useState } from "react"
import "./styles/main.css"

import wordsRaw from "../allwords.txt?raw"

const SPAM_SUFFIXES = [
  "ters",
  "ally",
  "ines",
  "tion",
  "raph",
  "ler",
  "omo"
]

export default function App(){

  const [query,setQuery] = useState("")

  const words = useMemo(()=>{

    return wordsRaw
      .split("\n")
      .map(w=>w.trim().toLowerCase())
      .filter(w=>w.length >= 3)

  },[])

  const isEndingSearch = query.startsWith(" ")

  const clean = query.trim().toLowerCase()

  const filtered = useMemo(()=>{

    if(!clean) return []

    let arr = words.filter(word=>{

      if(isEndingSearch){

        return word.endsWith(clean)

      }

      return word.startsWith(clean)

    })

    arr = [...new Set(arr)]

    arr.sort(()=>Math.random() - 0.5)

    return arr.slice(0,400)

  },[clean,isEndingSearch,words])

  function isTrap(word){

    const solves = words.filter(w=>{

      if(w === word) return false

      return w.startsWith(word)

    })

    if(solves.length < 3) return false

    const shortSolves = solves.filter(w=>{

      const diff = w.length - word.length

      return diff <= 2

    })

    if(shortSolves.length === 0){

      return true

    }

    const commonEnds = [

      "s",
      "es",
      "ed",
      "er",
      "ing"

    ]

    const valid = shortSolves.some(w=>{

      const extra = w.slice(word.length)

      return commonEnds.includes(extra)

    })

    return !valid

  }

  const traps3 = useMemo(()=>{

    const arr = filtered.filter(w=>
      w.length === 3 && isTrap(w)
    )

    arr.sort(()=>Math.random() - 0.5)

    return arr.slice(0,12)

  },[filtered])

  const traps4 = useMemo(()=>{

    const arr = filtered.filter(w=>
      w.length === 4 && isTrap(w)
    )

    arr.sort(()=>Math.random() - 0.5)

    return arr.slice(0,12)

  },[filtered])

  const spamWords = useMemo(()=>{

    const grouped = {}

    for(const suffix of SPAM_SUFFIXES){

      grouped[suffix] = []

    }

    for(const word of filtered){

      for(const suffix of SPAM_SUFFIXES){

        if(word.endsWith(suffix)){

          grouped[suffix].push(word)

        }

      }

    }

    const result = []

    let added = true
    let round = 0

    while(added){

      added = false

      for(const suffix of SPAM_SUFFIXES){

        if(grouped[suffix][round]){

          result.push({

            word:grouped[suffix][round],
            suffix
          })

          added = true

        }

      }

      round++

    }

    return result.slice(0,30)

  },[filtered])

  return(

    <div className="app">

      <h1>
        Word Trap Solver
      </h1>

      <input
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        placeholder='type letters or " ters"'
        className="search"
      />

      <section>

        <h2>
          Words
        </h2>

        <div className="grid">

          {filtered.map(word=>(

            <div
              key={word}
              className="word"
            >
              {word}
            </div>

          ))}

        </div>

      </section>

      <section>

        <h2>
          3 Letter Traps
        </h2>

        <div className="grid compact">

          {traps3.map(word=>(

            <div
              key={word}
              className="trap"
            >
              {word}
            </div>

          ))}

        </div>

      </section>

      <section>

        <h2>
          4 Letter Traps
        </h2>

        <div className="grid compact">

          {traps4.map(word=>(

            <div
              key={word}
              className="trap"
            >
              {word}
            </div>

          ))}

        </div>

      </section>

      <section>

        <h2>
          Spammable Chains
        </h2>

        <div className="spamGrid">

          {spamWords.map((item,index)=>(

            <div
              key={index}
              className="spam"
            >

              <span className="spamWord">
                {item.word}
              </span>

              <span className="suffix">
                → {item.suffix}
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>

  )

}