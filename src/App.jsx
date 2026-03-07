import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WordList from "./components/WordList";
import TrapSection from "./components/TrapSection";

import {
  loadWords,
  fastSearch,
  findSearchTraps
} from "./utils/wordProcessor";

export default function App() {

  const [results,setResults] = useState([]);
  const [trap2,setTrap2] = useState([]);
  const [trap3,setTrap3] = useState([]);
  const [trap4,setTrap4] = useState([]);
  const [bestTraps,setBestTraps] = useState([]);
  

  useEffect(()=>{

    fetch("/words.txt", { cache: "force-cache" })
      .then(r=>r.text())
      .then(text=>{

        const w = loadWords(text);

        console.log("WORDS LOADED:",w.length);

      });

  },[]);


 function handleSearch(query){

  const r = fastSearch(query)
    .slice(0,300)
    .sort((a,b)=>a.length-b.length || a.localeCompare(b));

  setResults(r);

  const t2 = findSearchTraps(r,2);
  const t3 = findSearchTraps(r,3);
  const t4 = findSearchTraps(r,4);

  setTrap2(t2);
  setTrap3(t3);
  setTrap4(t4);

  setBestTraps([...t2,...t3,...t4].slice(0,10));
}

  return (

    <div className="app">

      <h1>Word Finder</h1>

      <SearchBar onSearch={handleSearch} />

      <WordList words={results} />
      <TrapSection title="Best Trap Moves" traps={bestTraps} />

      <TrapSection title="2 Letter Traps" traps={trap2} />

      <TrapSection title="3 Letter Traps" traps={trap3} />

      <TrapSection title="4 Letter Traps" traps={trap4} />

    </div>

  );

}