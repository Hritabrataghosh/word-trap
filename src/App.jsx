import { useState } from "react"

export default function App(){

  const [letters,setLetters] = useState("")
  const [best,setBest] = useState("waiting")
  const [trap3,setTrap3] = useState("...")
  const [trap4,setTrap4] = useState("...")
  const [spam,setSpam] = useState("...")

  function solve(){

    if(!letters.trim()) return

    const txt = letters.toLowerCase()

    setBest(txt + "ing")
    setTrap3(txt + "ly")
    setTrap4(txt + "tion")
    setSpam(txt + "ines")

  }

  return(

    <div className="app">

      <div className="top">

        <input
          type="text"
          placeholder='type letters or " ters"'
          value={letters}
          onChange={(e)=>setLetters(e.target.value)}
        />

        <button onClick={solve}>
          Solve
        </button>

      </div>

      <div className="hud">

        <div className="box">
          <div className="label">BEST</div>
          <div className="value best">{best}</div>
        </div>

        <div className="box">
          <div className="label">3 TRAP</div>
          <div className="value trap3">{trap3}</div>
        </div>

        <div className="box">
          <div className="label">4 TRAP</div>
          <div className="value trap4">{trap4}</div>
        </div>

        <div className="box">
          <div className="label">SPAM</div>
          <div className="value spam">{spam}</div>
        </div>

      </div>

    </div>

  )

}