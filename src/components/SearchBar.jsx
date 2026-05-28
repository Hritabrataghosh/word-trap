export default function SearchBar({

  letters,
  setLetters

}){

  return(

    <div className="searchBar">

      <input
        type="text"
        placeholder='type letters or " ters"'
        value={letters}
        onChange={(e)=>setLetters(e.target.value)}

        onDoubleClick={()=>setLetters("")}
      />

    </div>

  )

}