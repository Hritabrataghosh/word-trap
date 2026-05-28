import { useState } from "react"
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

  function solve(){

    if(!letters.trim()) return

    const txt = letters.toLowerCase()

    const normal = [
      txt + "ing",
      txt + "er",
      txt + "ed",
      txt + "ation",
      txt + "ment"
    ]

    const t3 = [
      txt + "ly",
      txt + "ry",
      txt + "ty"
    ]

    const t4 = [
      txt + "tion",
      txt + "sion",
      txt + "ness"
    ]

    const t5 = [
      txt + "ingly",
      txt + "ation",
      txt + "ments"
    ]

    const spam = [
      txt + "s",
      txt + "es",
      txt + "ers",
      txt + "ines"
    ]

    setNormalWords(normal)
    setTrap3(t3)
    setTrap4(t4)
    setTrap5(t5)
    setSpamWords(spam)

  }

  return(

    <div className="app">

      <div className="title">
        Word Finder
      </div>

      <SearchBar
        letters={letters}
        setLetters={setLetters}
        solve={solve}
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