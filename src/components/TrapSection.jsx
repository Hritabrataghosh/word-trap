import { useState } from "react"

export default function TrapSection({ title, traps = [] }) {

  const [selected,setSelected] = useState(null)

  return (

    <div className="section">

      <h2>{title}</h2>

      <div className="list">

        {traps.map((t,i)=>(
          <span
            key={i}
            className="trap-chip"
            onClick={()=>setSelected(t)}
          >
            {t.ending} ({t.solutions.length})
          </span>
        ))}

      </div>

      {selected && (

        <div className="trap-details">

          <h3>
            Trap "{selected.ending}"
          </h3>

          <div className="list">

            {selected.solutions.map((w,i)=>(
              <span key={i} className="word">{w}</span>
            ))}

          </div>

        </div>

      )}

    </div>

  )

}