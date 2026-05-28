import { useState,useEffect } from "react"

import SearchBar from "./components/SearchBar"
import WordList from "./components/WordList"
import TrapSection from "./components/TrapSection"
import SpamSection from "./components/SpamSection"

import "./styles/main.css"

export default function App(){

  const [letters,setLetters] = useState("")

  const [normalWords,setNormalWords] = useState([])
  const [trap3,setTrap3] = useState([])
  const [trap4,setTrap4] = useState([])
  const [spamWords,setSpamWords] = useState([])

  useEffect(()=>{

    solve()

  },[letters])

  function shuffle(arr){

    return [...arr].sort(()=>Math.random()-.5)

  }

  function solve(){

    if(!letters.trim()){

      setNormalWords([])
      setTrap3([])
      setTrap4([])
      setSpamWords([])

      return

    }

    const txt = letters.toLowerCase()

    const normalPool = shuffle([

      txt + "ing",
      txt + "ed",
      txt + "er",
      txt + "est",
      txt + "ment",
      txt + "able",
      txt + "less",
      txt + "ness",
      txt + "ation",
      txt + "ify",
      txt + "ism",
      txt + "ive",
      txt + "ary",
      txt + "ory",
      txt + "ence"

    ])

    const trap3Pool = shuffle([

      txt + "ly",
      txt + "ty",
      txt + "ry",
      txt + "cy",
      txt + "sy",
      txt + "my",
      txt + "fy",
      txt + "gy"

    ])

    const trap4Pool = shuffle([

      txt + "tion",
      txt + "sion",
      txt + "ment",
      txt + "ness",
      txt + "ship",
      txt + "able",
      txt + "less",
      txt + "ward"

    ])

    const spamPool = shuffle([

      txt + "s",
      txt + "es",
      txt + "ers",
      txt + "ing",
      txt + "ings",
      txt + "ed",
      txt + "er",
      txt + "ly"

    ])

    setNormalWords(normalPool.slice(0,12))
    setTrap3(trap3Pool.slice(0,8))
    setTrap4(trap4Pool.slice(0,8))
    setSpamWords(spamPool.slice(0,10))

  }

  return(

    <div className="app">

      <div className="bgGlow"></div>

      <div className="title">
        Word Finder
      </div>

      <SearchBar
        letters={letters}
        setLetters={setLetters}
      />

      <WordList
        title="Normal Solves"
        words={normalWords}
      />

      <TrapSection
        title="3 Letter Traps"
        words={trap3}
      />

      <TrapSection
        title="4 Letter Traps"
        words={trap4}
      />

      <SpamSection
        words={spamWords}
      />

    </div>

  )

}