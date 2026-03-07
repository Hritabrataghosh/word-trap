export default function TrapSection({ title, traps = [] }) {

return (

<div className="section">

<h2>{title}</h2>

<div className="list">

{traps.map((t,i)=>(
<span key={i} className="word">
{t.word} → {t.ending} ({t.solutions}) 
<span style={{color:"#38bdf8"}}>
{t.solutions===1 ? "🔥" : t.solutions<=3 ? "⚡" : ""}
</span>
</span>
))}

</div>

</div>

);

}