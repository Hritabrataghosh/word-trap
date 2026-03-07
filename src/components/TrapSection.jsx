export default function TrapSection({ title, traps = [] }) {
  return (
    <div className="section">
      <h2>{title}</h2>

      <div className="trap-container">
        {traps.map((t, i) => (
          <div key={i} className="trap-row">

            <span className="trap-ending">
              {t.ending} ({t.solutions.length}) →
            </span>

            <div className="trap-words">
              {t.solutions.map((w, j) => (
                <span key={j} className="word">
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