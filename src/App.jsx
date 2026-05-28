import { useEffect, useMemo, useState } from "react"

import "./styles/main.css"

import wordsRaw from "../allwords.txt?raw"

export default function App(){

  const [letters,setLetters] = useState("")

  const words = useMemo(()=>{

    return wordsRaw

      .split("\n")

      .map(w=>w.trim().toLowerCase())

      .filter(w=>w.length >= 3)

  },[])

  useEffect(()=>{

    if(window.electronAPI){

      window.electronAPI.onOCR((word)=>{

        setLetters(word)

      })

    }

  },[])

  function matches(word,input){

    return word.startsWith(input)

  }

  const solves = useMemo(()=>{

    if(!letters) return []

    return words

      .filter(w=>matches(w,letters))

      .sort((a,b)=>a.length - b.length)

      .slice(0,500)

  },[letters,words])

  const best = solves[0] || "..."

  const trap3 = useMemo(()=>{

    return solves.find(w=>w.length === 3) || "..."

  },[solves])

  const trap4 = useMemo(()=>{

    return solves.find(w=>w.length === 4) || "..."

  },[solves])

  const spam = useMemo(()=>{

    const suffixes = [

      "tion",
      "ines",
      "ally",
      "ters",
      "raph",
      "ler",
      "omo"

    ]

    for(const s of suffixes){

      const found = solves.find(

        w=>w.endsWith(s)

      )

      if(found) return found

    }

    return solves[1] || "..."

  },[solves])

  return(

    <div className="overlay">

      <div className="hud">

        <div className="box">

          <div className="label">
            BEST
          </div>

          <div
            className="value"
            style={{color:"#49b7ff"}}
          >
            {best}
          </div>

        </div>

        <div className="box">

          <div className="label">
            3 TRAP
          </div>

          <div
            className="value"
            style={{color:"#ffc94d"}}
          >
            {trap3}
          </div>

        </div>

        <div className="box">

          <div className="label">
            4 TRAP
          </div>

          <div
            className="value"
            style={{color:"#ff79c6"}}
          >
            {trap4}
          </div>

        </div>

        <div className="box">

          <div className="label">
            SPAM
          </div>

          <div
            className="value"
            style={{color:"#74ffb0"}}
          >
            {spam}
          </div>

        </div>

      </div>

    </div>

  )

}