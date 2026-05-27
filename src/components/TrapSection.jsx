export default function TrapSection({

  title,
  traps=[],
  compact=false

}){

  return(

    <div className="section">

      <div className="section-header">

        <span>{title}</span>

        <span className="count">
          {traps.length}
        </span>

      </div>

      <div className={
        compact
        ? "compact-grid"
        : "trap-grid"
      }>

        {traps.map((t,i)=>(

          <div
            key={i}
            className="mini-trap"
          >

            <div className="mini-play">

              <span className="play-word">
                {t.play}
              </span>

              <span className="arrow">
                →
              </span>

              <span className="trap-end">
                {t.ending}
              </span>

            </div>

            <div className="mini-solves">

              {t.solutions.map((w,j)=>(

                <span
                  key={j}
                  className="word"
                >
                  {w}
                </span>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}