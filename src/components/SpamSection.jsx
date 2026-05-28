export default function SpamSection({

  words

}){

  return(

    <div className="section">

      <h2>Spam Words</h2>

      <div className="wordGrid">

        {words.map((w,i)=>(

          <div key={i} className="wordCard spam">
            {w}
          </div>

        ))}

      </div>

    </div>

  )

}