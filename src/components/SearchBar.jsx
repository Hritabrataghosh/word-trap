import { useState } from "react"

export default function SearchBar({ onSearch }) {

  const [value,setValue] = useState("")

  function handleChange(e){
    const v = e.target.value
    setValue(v)
    onSearch(v)
  }

  function handleFocus(){
    if(value !== ""){
      setValue("")
      onSearch("")
    }
  }

  return(

    <input
      className="search"
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder="type letters..."
    />

  )

}