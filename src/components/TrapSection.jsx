export default function TrapSection({
title,
traps=[]
}){

return(

<div className="section">

<div className="section-header">
{title}
</div>

<div className="trap-grid">

{traps.map((t,i)=>(

<div
key={i}
className="trap-card"
>

<div className="trap-label">

{t.play
? t.play
: `${t.ending} (${t.solutions.length})`
}

</div>

{t.solutions && (

<div className="trap-words">

{t.solutions.map((s,j)=>(

<span
key={j}
className="word"
>
{s}
</span>

))}

</div>

)}

</div>

))}

</div>

</div>

)

}