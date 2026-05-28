export default function SearchBar({

  letters,
  setLetters,
  solve

}){

  return(

    <div className="searchBar">

      <input
        type="text"
        placeholder='type letters or " ters"'
        value={letters}
        onChange={(e)=>setLetters(e.target.value)}
      />

      <button onClick={solve}>
        Solve
      </button>

    </div>

  )

}