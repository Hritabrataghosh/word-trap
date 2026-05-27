export default function WordList({ words = [] }){

return(

<div className="list">

{words
.filter(w=>w.length >= 3)
.map((w,i)=>(

<span key={i} className="word">
{w}
</span>

))}

</div>

)

}