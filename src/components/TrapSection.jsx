import { useState } from "react"

export default function TrapSection({ title, traps = [] }) {

  return (
    <div className="section">

      <h2>{title}</h2>

      <div className="trap-grid">

        {traps.map((t,i)=>(
          <TrapRow key={i} trap={t}/>
        ))}

      </div>

    </div>
  )
}

function TrapRow({trap}){

  const [open,setOpen] = useState(false)

  const words = open ? trap.solutions : trap.solutions.slice(0,3)

  return(

    <div className="trap-card">

      <span className="trap-label">
        {trap.ending} ({trap.solutions.length}) →
      </span>

      <div className="trap-words">

        {words.map((w,i)=>(
          <span key={i} className="word">{w}</span>
        ))}

        {!open && trap.solutions.length > 3 && (
          <span
            className="more"
            onClick={()=>setOpen(true)}
          >
            +{trap.solutions.length-3}
          </span>
        )}

      </div>

    </div>

  )
}