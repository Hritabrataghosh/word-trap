import { useState, useEffect } from "react"

export default function TrapSection({title,traps,reset}){

const [open,setOpen] = useState(false)

useEffect(()=>{
  setOpen(false)
},[reset])

return(

<div className="trap-section">

<div
className="trap-header"
onClick={()=>setOpen(!open)}
>

<span>{open ? "▼" : "▶"} {title}</span>
<span>{traps.length} traps</span>

</div>

{open && (

<div className="trap-grid">

{traps.map((t,i)=>(
<div key={i} className="trap-item">

<span className="trap-ending">
{t.ending} ({t.solutions.length}) →
</span>

{t.solutions.map((w,j)=>(
<span key={j} className="trap-word">
{w}
</span>
))}

</div>
))}

</div>

)}

</div>

)

}