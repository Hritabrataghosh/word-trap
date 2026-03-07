import {useState,useEffect} from "react"

export default function SearchBar({onSearch}){

const [value,setValue] = useState("")

useEffect(()=>{

const t = setTimeout(()=>{

onSearch(value)

},100)

return ()=>clearTimeout(t)

},[value])

return(

<input
className="search"
placeholder="Enter starting letters..."
value={value}
onChange={e=>setValue(e.target.value)}
/>

)

}