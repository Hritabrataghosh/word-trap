export default function WordList({

  title,
  words

}){

  return(

    <div className="section">

      <h2>{title}</h2>

      <div className="wordGrid">

        {words.map((w,i)=>(

          <div key={i} className="wordCard normal">
            {w}
          </div>

        ))}

      </div>

    </div>

  )

}