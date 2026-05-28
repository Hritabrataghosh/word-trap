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
  const [trap5,setTrap5] = useState([])
  const [spamWords,setSpamWords] = useState([])

  useEffect(()=>{

    solve()

  },[letters])

  function solve(){

    if(!letters.trim()){

      setNormalWords([])
      setTrap3([])
      setTrap4([])
      setTrap5([])
      setSpamWords([])

      return

    }

    const txt = letters.toLowerCase()

    setNormalWords([

      txt + "ing",
      txt + "er",
      txt + "ed",
      txt + "ment",
      txt + "ation",
      txt + "ness"

    ])

    setTrap3([

      txt + "ly",
      txt + "ry",
      txt + "ty",
      txt + "cy"

    ])

    setTrap4([

      txt + "tion",
      txt + "sion",
      txt + "ness",
      txt + "ment"

    ])

    setTrap5([

      txt + "ingly",
      txt + "ments",
      txt + "ation",
      txt + "lessly"

    ])

    setSpamWords([

      txt + "s",
      txt + "es",
      txt + "ers",
      txt + "ines",
      txt + "ings"

    ])

  }

  return(

    <div className="app">

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

      <TrapSection
        title="5 Letter Traps"
        words={trap5}
      />

      <SpamSection
        words={spamWords}
      />

    </div>

  )

}