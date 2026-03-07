export default function WordList({ words }) {

  return (

    <div className="section">

      <h2>Words</h2>

      <div className="list">

        {words.map((w,i) => (
          <span key={i} className="word">
            {w}
          </span>
        ))}

      </div>

    </div>

  )

}