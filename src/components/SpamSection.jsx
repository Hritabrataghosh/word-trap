export default function SpamSection({spam=[]}){

if(spam.length===0){
return null
}

return(

<div className="section">

<div className="section-header">

<span>Spammable Chains</span>

<span className="count">
{spam.length}
</span>

</div>

<div className="trap-grid">

{spam.map((s,i)=>(

<div key={i} className="trap-card">

<span className="trap-label">
{s.word}
</span>

<span className="arrow">
→
</span>

<span className="trap-end">
{s.ending}
</span>

</div>

))}

</div>

</div>

)

}