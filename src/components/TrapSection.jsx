export default function TrapSection({

  title,
  words

}){

  return(

    <div className="section">

      <h2>{title}</h2>

      <div className="wordGrid">

        {words.map((w,i)=>(

          <div
            key={i}
            className="wordCard trap"
          >
            {w}
          </div>

        ))}

      </div>

    </div>

  )

}