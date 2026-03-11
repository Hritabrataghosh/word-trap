import { useState } from "react"

export default function TrapSection({ title, traps = [] }) {

  if(traps.length === 0) return null

  return(

    <div className="section">

      <div className="section-header">

        <span>{title}</span>

        <span className="count">
          {traps.length} traps
        </span>

      </div>

      <div className="trap-grid">

        {traps.map((t,i)=>(
          <TrapRow key={i} trap={t}/>
        ))}

      </div>

    </div>

  )

}

function TrapRow({trap}){

  const [expand,setExpand] = useState(false)

  const words = expand
    ? trap.solutions
    : trap.solutions.slice(0,3)

  return(

    <div className="trap-card">

      <span className="trap-label">
        {trap.ending} ({trap.solutions.length}) →
      </span>

      <div className="trap-words">

        {words.map((w,i)=>(
          <span key={i} className="word">
            {w}
          </span>
        ))}

        {!expand && trap.solutions.length > 3 && (

          <span
            className="more"
            onClick={()=>setExpand(true)}
          >
            +{trap.solutions.length-3}
          </span>

        )}

      </div>

    </div>

  )

}