import { useState } from "react"

export default function TrapSection({ title, traps = [] }) {

  return (
    <div className="section">
      <h2>{title}</h2>

      {traps.map((t, i) => (
        <TrapRow key={i} trap={t}/>
      ))}

    </div>
  )
}

function TrapRow({ trap }) {

  const [open,setOpen] = useState(false)

  const visible = open ? trap.solutions : trap.solutions.slice(0,3)

  return (

    <div className="trap-row">

      <span className="trap-ending">
        {trap.ending} ({trap.solutions.length}) →
      </span>

      <div className="trap-words">

        {visible.map((w,i)=>(
          <span key={i} className="word">{w}</span>
        ))}

        {!open && trap.solutions.length > 3 && (
          <span
            className="more"
            onClick={()=>setOpen(true)}
          >
            +{trap.solutions.length - 3}
          </span>
        )}

      </div>

    </div>

  )
}