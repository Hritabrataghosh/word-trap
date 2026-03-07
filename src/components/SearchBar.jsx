import { useState } from "react";

export default function SearchBar({ onSearch }) {

const [value,setValue] = useState("");

function handleChange(e){

const v = e.target.value;

setValue(v);
onSearch(v);

}

function handleFocus(){

setValue("");
onSearch("");

}

return(

<div className="search-container">

<input
type="text"
value={value}
placeholder="Search letters..."
onChange={handleChange}
onFocus={handleFocus}
/>

</div>

);

}